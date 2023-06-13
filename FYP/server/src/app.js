
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
//add path
const path = require('path');
//instead of bodyParser

//add server side rendering
//const ejs = require('ejs');



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
app.use('/public', express.static(path.join(__dirname, 'public'), {index: 'home.html'}))
// add the examples below, can remove later
//app.use('/public/examples', express.static(path.join(__dirname, 'public')))


app.set('view engine', 'ejs');
/*
app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});
*/
app.use('/api/v1', api);
// app.set('views', './public');

// app.get('/view_structure', (req, res) => {
//   // Set the host variable based on the request's hostname or any other logic
//   const host = req.hostname;
//   // Render the view_structure.ejs file with the host variable
//   res.render('view_structure', { host });
// });
// app.get('/submit_job', (req, res) => {
//   // Set the host variable based on the request's hostname or any other logic
//   const host = req.hostname;
//   // Render the view_structure.ejs file with the host variable
//   res.render('submit_job', { host });
// });

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
