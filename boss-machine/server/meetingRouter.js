const express = require('express')
const {
    getAllFromDatabase,
    createMeeting,
    addToDatabase,
    deleteAllFromDatabase
 } = require('./db')

const meetingRouter = express.Router();

meetingRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('meetings'))
})

meetingRouter.post('/', (req, res, next) => {
    const newMeeting = createMeeting();
    const addedMeeting = addToDatabase('meetings', newMeeting);
    res.status(201).send(addedMeeting)
})

meetingRouter.delete('/', (req, res, next) => {
    deleteAllFromDatabase('meetings');
    res.status(204).send()
})

module.exports = meetingRouter;