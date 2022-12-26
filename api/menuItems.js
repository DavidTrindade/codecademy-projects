const express = require('express');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(
    process.env.TEST_DATABASE || './database.sqlite'
);

const menuItemsRouter = express.Router({ mergeParams: true });

menuItemsRouter.get('/', (req, res, next) => {
    db.all(
        'SELECT * FROM MenuItem WHERE menu_id  = $menuId',
        {
            $menuId: req.params.menuId,
        },
        (err, menuItems) => {
            if (err) return next(err);

            res.json({ menuItems });
        }
    );
});

menuItemsRouter.post('/', (req, res, next) => {
    const { name, description, inventory, price } = req.body.menuItem;

    if (!name || !description || !inventory || !price) {
        return res.sendStatus(400);
    }

    db.run(
        'INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menuId)',
        {
            $name: name,
            $description: description,
            $inventory: inventory,
            $price: price,
            $menuId: req.params.menuId,
        },
        function cb(err) {
            if (err) return next(err);
            db.get(
                'SELECT * FROM MenuItem WHERE id = $id',
                { $id: this.lastID },
                (err, menuItem) => {
                    if (err) return next(err);
                    res.status(201).json({ menuItem });
                }
            );
        }
    );
});

menuItemsRouter.param('menuItemId', (req, res, next, id) => {
    db.get(
        'SELECT * FROM MenuItem WHERE id = $id',
        { $id: id },
        (err, menuItem) => {
            if (err) return next(err);

            if (menuItem) return next();

            res.sendStatus(404);
        }
    );
});

menuItemsRouter.put('/:menuItemId', (req, res, next) => {
    const { name, description, inventory, price } = req.body.menuItem;

    if (!name || !description || !inventory || !price) {
        return res.sendStatus(400);
    }

    db.run(
        'UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price WHERE id = $menuItemId AND menu_id = $menuId',
        {
            $name: name,
            $description: description,
            $inventory: inventory,
            $price: price,
            $menuItemId: req.params.menuItemId,
            $menuId: req.params.menuId,
        },
        err => {
            if (err) return next(err);
            db.get(
                'SELECT * FROM MenuItem WHERE id = $id',
                { $id: req.params.menuItemId },
                (err, menuItem) => {
                    if (err) return next(err);
                    res.json({ menuItem });
                }
            );
        }
    );
});

menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
    db.run(
        'DELETE FROM MenuItem WHERE id = $id',
        { $id: req.params.menuItemId },
        err => {
            if (err) return next(err);
            res.sendStatus(204);
        }
    );
});

module.exports = menuItemsRouter;
