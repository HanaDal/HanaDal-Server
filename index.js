const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log('Connected to Mongo'))
  .catch(err => console.log(err));

app.set('PORT', process.env.PORT)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use('/api', require('./routes/index'))
  .use('/privacy-policy', express.static('public/privacy.html'))
  .get('/', (req, res) => res.json({ result: 'success' }));

module.exports = app;
