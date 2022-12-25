const express = require('express');
const app = require('../server');

const apiRouter = express.Router();

const artistRouter = require('./artists');

apiRouter.use('/artists', artistRouter);

module.exports = apiRouter;
