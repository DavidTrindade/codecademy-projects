const express = require('express');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(
    process.env.TEST_DATABASE || './database.sqlite'
);

const timesheetsRouter = express.Router({ mergeParams: true });

timesheetsRouter.get('/', (req, res, next) => {
    db.all(
        'SELECT * FROM Timesheet WHERE employee_id = $employeeId',
        {
            $employeeId: req.params.employeeId,
        },
        (err, timesheets) => {
            if (err) return next(err);
            res.json({ timesheets });
        }
    );
});

timesheetsRouter.post('/', (req, res, next) => {
    const { hours, rate, date } = req.body.timesheet;

    if (!hours || !rate || !date) {
        return res.sendStatus(400);
    }

    db.run(
        'INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $employeeId)',
        {
            $hours: hours,
            $rate: rate,
            $date: date,
            $employeeId: req.params.employeeId,
        },
        function cb(err) {
            if (err) return next(err);
            db.get(
                'SELECT * FROM Timesheet WHERE id = $id',
                { $id: this.lastID },
                (err, timesheet) => {
                    if (err) return next(err);
                    res.status(201).json({ timesheet });
                }
            );
        }
    );
});

timesheetsRouter.param('timesheetId', (req, res, next, id) => {
    db.get(
        'SELECT * FROM Timesheet WHERE id = $id',
        { $id: id },
        (err, timesheet) => {
            if (err) return next(err);

            if (timesheet) return next();

            res.sendStatus(404);
        }
    );
});

timesheetsRouter.put('/:timesheetId', (req, res, next) => {
    const { hours, rate, date } = req.body.timesheet;

    if (!hours || !rate || !date) {
        return res.sendStatus(400);
    }

    db.run(
        'UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date WHERE id = $timesheetId AND employee_id = $employeeId',
        {
            $hours: hours,
            $rate: rate,
            $date: date,
            $timesheetId: req.params.timesheetId,
            $employeeId: req.params.employeeId,
        },
        err => {
            if (err) return next(err);
            db.get(
                'SELECT * FROM Timesheet WHERE id = $id',
                { $id: req.params.timesheetId },
                (err, timesheet) => {
                    if (err) return next(err);
                    res.json({ timesheet });
                }
            );
        }
    );
});

timesheetsRouter.delete('/:timesheetId', (req, res, next) => {
    db.run(
        'DELETE FROM Timesheet WHERE id = $id',
        { $id: req.params.timesheetId },
        err => {
            if (err) return next(err);
            res.sendStatus(204);
        }
    );
});

module.exports = timesheetsRouter;
