const express = require('express');
const sqlite3 = require('sqlite3');

const issuesRouter = express.Router({ mergeParams: true });

const db = new sqlite3.Database(
    process.env.TEST_DATABASE || './database.sqlite'
);

issuesRouter.get('/', (req, res, next) => {
    db.all(
        'SELECT * FROM Issue WHERE series_id = $seriesId',
        { $seriesId: req.params.seriesId },
        (err, issues) => {
            if (err) return next(err);
            res.json({ issues });
        }
    );
});

issuesRouter.post('/', (req, res, next) => {
    const { name, issueNumber, publicationDate, artistId } = req.body.issue;

    if (!name || !issueNumber || !publicationDate || !artistId) {
        return res.sendStatus(400);
    }

    db.get(
        'SELECT * FROM Artist WHERE id = $id',
        { $id: artistId },
        (err, artist) => {
            if (err) return next(err);

            if (!artist) return res.sendStatus(400);
        }
    );

    db.run(
        'INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)',
        {
            $name: name,
            $issueNumber: issueNumber,
            $publicationDate: publicationDate,
            $artistId: artistId,
            $seriesId: req.params.seriesId,
        },
        function cb(err) {
            if (err) return next(err);
            db.get(
                'SELECT * FROM Issue WHERE id = $id',
                { $id: this.lastID },
                (err, issue) => {
                    if (err) return next(err);
                    res.status(201).json({ issue });
                }
            );
        }
    );
});

issuesRouter.param('issueId', (req, res, next, id) => {
    db.get('SELECT * FROM Issue WHERE id = $id', { $id: id }, (err, issue) => {
        if (err) return next(err);

        if (issue) return next();

        res.sendStatus(404);
    });
});

issuesRouter.put('/:issueId', (req, res, next) => {
    const { name, issueNumber, publicationDate, artistId } = req.body.issue;

    if (!name || !issueNumber || !publicationDate || !artistId) {
        return res.sendStatus(400);
    }

    db.get(
        'SELECT * FROM Artist WHERE id = $id',
        { $id: artistId },
        (err, artist) => {
            if (err) return next(err);

            if (!artist) return res.sendStatus(400);
        }
    );

    db.run(
        'UPDATE Issue SET name = $name, issue_number = $issueNumber, publication_date = $publicationDate, artist_id = $artistId WHERE id = $id AND series_id = $seriesId',
        {
            $name: name,
            $issueNumber: issueNumber,
            $publicationDate: publicationDate,
            $artistId: artistId,
            $id: req.params.issueId,
            $seriesId: req.params.seriesId,
        },
        err => {
            if (err) return next(err);
            db.get(
                'SELECT * FROM Issue WHERE id = $id',
                { $id: req.params.issueId },
                (err, issue) => {
                    if (err) return next(err);
                    res.json({ issue });
                }
            );
        }
    );
});

issuesRouter.delete('/:issueId', (req, res, next) => {
    db.run(
        'DELETE FROM Issue WHERE id = $id',
        { $id: req.params.issueId },
        err => {
            if (err) return next(err);
            res.sendStatus(204);
        }
    );
});

module.exports = issuesRouter;
