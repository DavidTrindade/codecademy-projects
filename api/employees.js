const express = require('express');
const sqlite3 = require('sqlite3');
const { response } = require('../server');

const employeesRouter = express.Router();

const db = new sqlite3.Database(
    process.env.TEST_DATABASE || './database.sqlite'
);

employeesRouter.get('/', (req, res, next) => {
    db.all(
        'SELECT * FROM Employee WHERE is_current_employee = 1',
        (err, employees) => {
            if (err) return next(err);
            res.json({ employees });
        }
    );
});

employeesRouter.post('/', (req, res, next) => {
    const { name, position, wage } = req.body.employee;
    const isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;

    if (!name || !position || !wage) {
        res.sendStatus(400);
    }

    db.run(
        'INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ($name, $position, $wage, $isCurrentEmployee)',
        {
            $name: name,
            $position: position,
            $wage: wage,
            $isCurrentEmployee: isCurrentEmployee,
        },
        function cb(err) {
            if (err) return next(err);
            db.get(
                'SELECT * FROM Employee WHERE id = $id',
                { $id: this.lastID },
                (err, employee) => {
                    if (err) return next(err);
                    res.status(201).json({ employee });
                }
            );
        }
    );
});

employeesRouter.param('employeeId', (req, res, next, id) => {
    db.get(
        'SELECT * FROM Employee WHERE id = $id',
        { $id: id },
        (err, employee) => {
            if (err) return next(err);

            if (employee) {
                req.employee = employee;
                return next();
            }

            res.sendStatus(404);
        }
    );
});

employeesRouter.get('/:employeeId', (req, res, next) => {
    res.send({ employee: req.employee });
});

module.exports = employeesRouter;
