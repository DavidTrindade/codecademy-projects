const express = require('express');
const sqlite3 = require('sqlite3');

const artistRouter = express.Router();

const db = new sqlite3.Database(
    process.env.TEST_DATABASE || './database.sqlite'
);

artistRouter.get('/', (req, res, next) => {
    db.all(
        'SELECT * FROM Artist WHERE is_currently_employed = 1',
        (err, artists) => {
            if (err) return next(err);
            res.json({ artists });
        }
    );
});

artistRouter.post('/', (req, res, next) => {
    let { name, dateOfBirth, biography, isCurrentlyEmployed } = req.body.artist;
    if (!name || !dateOfBirth || !biography) {
        return res.sendStatus(400);
    }

    isCurrentlyEmployed = isCurrentlyEmployed === 0 ? 0 : 1;

    db.run(
        'INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $dateOfBirth, $biography, $isCurrentlyEmployed)',
        {
            $name: name,
            $dateOfBirth: dateOfBirth,
            $biography: biography,
            $isCurrentlyEmployed: isCurrentlyEmployed,
        },
        function cb(err) {
            if (err) return next(err);
            db.get(
                'SELECT * FROM Artist WHERE id = $id',
                { $id: this.lastID },
                (err, artist) => {
                    if (err) return next(err);
                    res.status(201).json({ artist });
                }
            );
        }
    );
});

artistRouter.param('artistId', (req, res, next, id) => {
    db.get(
        'SELECT * FROM Artist WHERE id = $id',
        { $id: id },
        (err, artist) => {
            if (err) return next(err);

            if (artist) {
                req.artist = artist;
                return next();
            }

            res.sendStatus(404);
        }
    );
});

artistRouter.get('/:artistId', (req, res, next) => {
    res.json({ artist: req.artist });
});

artistRouter.put('/:artistId', (req, res, next) => {
    let { name, dateOfBirth, biography, isCurrentlyEmployed } = req.body.artist;

    if (!name || !dateOfBirth || !biography) {
        return res.sendStatus(400);
    }

    isCurrentlyEmployed = isCurrentlyEmployed === 0 ? 0 : 1;

    db.run(
        'UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography, is_currently_employed = $isCurrentlyEmployed WHERE id = $id',
        {
            $name: name,
            $dateOfBirth: dateOfBirth,
            $biography: biography,
            $isCurrentlyEmployed: isCurrentlyEmployed,
            $id: req.params.artistId,
        },
        err => {
            if (err) return next(err);
            db.get(
                'SELECT * FROM Artist WHERE id = $id',
                { $id: req.params.artistId },
                (err, artist) => {
                    if (err) return next(err);
                    res.json({ artist });
                }
            );
        }
    );
});

artistRouter.delete('/:artistId', (req, res, next) => {
    db.run(
        'UPDATE Artist SET is_currently_employed = 0 WHERE id = $id',
        { $id: req.params.artistId },
        err => {
            if (err) return next(err);
            db.get(
                'SELECT * FROM Artist WHERE id = $id',
                { $id: req.params.artistId },
                (err, artist) => {
                    if (err) return next(err);
                    res.json({ artist });
                }
            );
        }
    );
});

module.exports = artistRouter;
