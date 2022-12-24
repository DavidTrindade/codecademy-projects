const express = require('express')

const apiRouter = express.Router();

const minionRouter = require('./minionRouter');
const ideaRouter = require('./ideaRouter');
const meetingRouter = require('./meetingRouter');

apiRouter.use('/minions', minionRouter);
apiRouter.use('/ideas', ideaRouter);
apiRouter.use('/meetings', meetingRouter);

module.exports = apiRouter;
