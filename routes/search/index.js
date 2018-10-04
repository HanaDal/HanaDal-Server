const router = require('express').Router();
const ctrl = require('./search.ctrl');

router.get('/', ctrl.search);

module.exports = router;
