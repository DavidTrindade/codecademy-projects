const express = require('express');
const app = require('../server');

const apiRouter = express.Router();

const artistRouter = require('./artists');
const seriesRouter = require('./series');

apiRouter.use('/artists', artistRouter);
apiRouter.use('/series', seriesRouter);

module.exports = apiRouter;
