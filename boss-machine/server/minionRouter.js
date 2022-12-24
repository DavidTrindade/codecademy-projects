const express = require('express');

const {
    getAllFromDatabase,
    getFromDatabaseById,
    updateInstanceInDatabase,
    addToDatabase,
    deleteFromDatabasebyId,
} = require('./db');

const minionRouter = express.Router();

minionRouter.param('minionId', (req, res, next, id) => {
    const minion = getFromDatabaseById('minions', id);
    if (!minion) {
        return res.status(404).send('Item with that ID does not exist');
    }
    req.minion = minion;
    next();
});

minionRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('minions'));
});

minionRouter.post('/', (req, res, next) => {
    const newMinion = addToDatabase('minions', req.body);
    res.status(201).send(newMinion);
});

minionRouter.get('/:minionId', (req, res, next) => {
    res.send(req.minion);
});

minionRouter.put('/:minionId', (req, res, next) => {
    const updatedMinion = updateInstanceInDatabase('minions', req.body);
    res.send(updatedMinion);
});

minionRouter.delete('/:minionId', (req, res, next) => {
    const deleted = deleteFromDatabasebyId('minions', req.params.minionId);
    if (!deleted) {
        return res.status(500).send();
    }
    res.status(204).send();
});

const workRouter = express.Router({ mergeParams: true });

workRouter.param('workId', (req, res, next, id) => {
    const work = getFromDatabaseById('work', id);
    if (!work) {
        return res.status(404).send('Invalid work ID entered');
    }
    req.work = work;
    next();
});

workRouter.get('/', (req, res, next) => {
    const work = getAllFromDatabase('work').filter(
        e => e.minionId === req.params.minionId
    );
    res.send(work);
});

workRouter.post('/', (req, res, next) => {
    const newWork = addToDatabase('work', req.body);
    res.status(201).send(newWork);
});

workRouter.put('/:workId', (req, res, next) => {
    if (req.body.minionId !== req.params.minionId) {
        return res.status(400).send();
    }
    const updatedWork = updateInstanceInDatabase('work', req.body);
    res.send(updatedWork);
});

workRouter.delete('/:workId', (req, res, next) => {
    const deleted = deleteFromDatabasebyId('work', req.params.workId);
    if (!deleted) {
        return res.status(500).send();
    }
    res.status(204).send();
});

minionRouter.use('/:minionId/work', workRouter);

module.exports = minionRouter;
