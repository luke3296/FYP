
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
//add path
const path = require('path');
//instead of bodyParser


require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');
const { strictEqual } = require('assert');

const app = express();

app.use(morgan('dev'));
// set contentSecurityPolicy: false,
app.use(helmet( {
  contentSecurityPolicy: false,
}));
var corsOptions = {
  origin: "http://localhost:5123"
};

app.use(cors(corsOptions));
app.use(express.json());
//mount public files on /public
app.use('/public', express.static(path.join(__dirname, 'public')))
// add the examples below, can remove later
app.use('/public/examples', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
