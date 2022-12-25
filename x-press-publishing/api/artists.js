const express = require('express');
const sqlite3 = require('sqlite3');

const artistRouter = express.Router();
const db = new sqlite3.Database(
    process.env.TEST_DATABASE || './database.sqlite'
);

artistRouter.get('/', (req, res, next) => {
    db.all(
        'SELECT * FROM Artist WHERE is_currently_employed = 1',
        (err, rows) => {
            if (err) {
                return next(err);
            }
            res.send({ artists: rows });
        }
    );
});

module.exports = artistRouter;
