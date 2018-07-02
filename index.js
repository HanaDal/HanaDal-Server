const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

app.set('PORT', process.env.PORT)
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended : true}))
    .use('/api', require('./routes/index'))
    .get('/', (req, res) => res.send('<h1>Hello, World!</h1>'));

module.exports = app;