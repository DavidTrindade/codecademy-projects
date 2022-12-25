const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const errorhandler = require('errorhandler');

const app = express();

const PORT = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use(errorhandler());
app.use(cors());
app.use(morgan('dev'));

const apiRouter = require('./api/api');

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
