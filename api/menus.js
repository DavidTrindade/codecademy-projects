const express = require('express');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(
    process.env.TEST_DATABASE || './database.sqlite'
);

const menusRouter = express.Router();

menusRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Menu', (err, menus) => {
        if (err) return next(err);
        res.json({ menus });
    });
});

menusRouter.post('/', (req, res, next) => {
    const { title } = req.body.menu;

    if (!title) {
        return res.sendStatus(400);
    }

    db.run(
        'INSERT INTO Menu (title) VALUES ($title)',
        {
            $title: title,
        },
        function cb(err) {
            if (err) return next(err);
            db.get(
                'SELECT * FROM Menu WHERE id = $id',
                { $id: this.lastID },
                (err, menu) => {
                    if (err) return next(err);
                    res.status(201).json({ menu });
                }
            );
        }
    );
});

menusRouter.param('menuId', (req, res, next, id) => {
    db.get('SELECT * FROM Menu WHERE id = $id', { $id: id }, (err, menu) => {
        if (err) return next(err);

        if (menu) {
            req.menu = menu;
            return next();
        }

        res.sendStatus(404);
    });
});

menusRouter.get('/:menuId', (req, res, next) => {
    res.json({ menu: req.menu });
});

menusRouter.put('/:menuId', (req, res, next) => {
    const { title } = req.body.menu;

    if (!title) {
        return res.sendStatus(400);
    }

    db.run(
        'UPDATE Menu SET title = $title WHERE id = $id',
        {
            $title: title,
            $id: req.params.menuId,
        },
        err => {
            if (err) return next(err);
            db.get(
                'SELECT * FROM Menu WHERE id = $id',
                { $id: req.params.menuId },
                (err, menu) => {
                    if (err) return next(err);
                    res.json({ menu });
                }
            );
        }
    );
});

menusRouter.delete('/:menuId', (req, res, next) => {
    db.get(
        'SELECT * FROM MenuItem WHERE menu_id = $id',
        {
            $id: req.params.menuId,
        },
        (err, menuItem) => {
            if (err) return next(err);
            if (menuItem) return res.sendStatus(400);

            db.run(
                'DELETE FROM Menu WHERE id = $id',
                { $id: req.params.menuId },
                err => {
                    if (err) return next(err);
                    res.sendStatus(204);
                }
            );
        }
    );
});

module.exports = menusRouter;
