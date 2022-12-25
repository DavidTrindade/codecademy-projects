const express = require('express');
const sqlite3 = require('sqlite3');

const seriesRouter = express.Router();
const db = new sqlite3.Database(
    process.env.TEST_DATABASE || './database.sqlite'
);

seriesRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Series', (err, series) => {
        if (err) {
            return next(err);
        }
        res.json({ series });
    });
});

seriesRouter.post('/', (req, res, next) => {
    const { name, description } = req.body.series;
    if (!name || !description) {
        return res.sendStatus(400);
    }

    db.run(
        'INSERT INTO Series (name, description) VALUES ($name, $description)',
        {
            $name: name,
            $description: description,
        },
        function cb(err) {
            if (err) return next(err);
            db.get(
                'SELECT * FROM Series WHERE id = $id',
                { $id: this.lastID },
                (err, series) => {
                    if (err) return next(err);
                    res.status(201).json({ series });
                }
            );
        }
    );
});

seriesRouter.param('seriesId', (req, res, next, id) => {
    db.get(
        'SELECT * FROM Series WHERE id = $id',
        { $id: id },
        (err, series) => {
            if (err) return next(err);

            if (series) {
                req.series = series;
                return next();
            }

            res.sendStatus(404);
        }
    );
});

seriesRouter.get('/:seriesId', (req, res, next) => {
    res.json({ series: req.series });
});

seriesRouter.put('/:seriesId', (req, res, next) => {
    const { name, description } = req.body.series;
    if (!name || !description) {
        return res.sendStatus(400);
    }

    db.run(
        'UPDATE Series SET name = $name, description = $description WHERE id = $id',
        {
            $name: name,
            $description: description,
            $id: req.params.seriesId,
        },
        err => {
            if (err) return next(err);
            db.get(
                'SELECT * FROM Series WHERE id = $id',
                { $id: req.params.seriesId },
                (err, series) => {
                    if (err) return next(err);
                    res.json({ series });
                }
            );
        }
    );
});

module.exports = seriesRouter;
