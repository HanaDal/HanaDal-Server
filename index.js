const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGODB_URI);

const PORT = process.env.PORT || 12345;

express()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended : true}))
    .get('/', (req, res) => res.send("<h1>Hello, World!</h1>"))
    .listen(PORT, () => console.log(`Listening at ${PORT}`));