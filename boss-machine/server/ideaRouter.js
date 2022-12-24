const express = require('express');

const {
    getAllFromDatabase,
    getFromDatabaseById,
    updateInstanceInDatabase,
    addToDatabase,
    deleteFromDatabasebyId
 } = require('./db')

const checkMillionDollarIdea = require('./checkMillionDollarIdea');

const ideaRouter = express.Router();

ideaRouter.param('ideaId', (req, res, next, id) => {
    const idea = getFromDatabaseById('ideas', id);
    if (!idea) {
        return res.status(404).send('Item with that ID does not exist')
    }
    req.idea = idea;
    next();
})

ideaRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('ideas'))
})

ideaRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
    const newIdea = addToDatabase('ideas', req.body);
    res.status(201).send(newIdea)
});

ideaRouter.get('/:ideaId', (req, res, next) => {
    res.send(req.idea);
})

ideaRouter.put('/:ideaId', checkMillionDollarIdea, (req, res, next) => {
    const updatedIdea = updateInstanceInDatabase('ideas', req.body)
    res.send(updatedIdea)
})

ideaRouter.delete('/:ideaId', (req, res, next) => {
    const deleted = deleteFromDatabasebyId('ideas', req.params.ideaId);
    if (!deleted) {
        return res.status(500).send()
    }
    res.status(204).send()
})






module.exports = ideaRouter;