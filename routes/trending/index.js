const router = require('express').Router();
const ctrl = require('./trending.ctrl');

router.get('/challenge', ctrl.getTrendingChallenges)
  .get('/book', ctrl.getTrendingBooks);

module.exports = router;
