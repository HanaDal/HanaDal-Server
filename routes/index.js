const router = require('express').Router();

router.use('/user', require('./user/index'))
  .use('/challenge', require('./challenge/index'))
  .use('/qna', require('./qna/index'))
  .use('/docs', require('./docs/index'))
  .use('/search', require('./search/index'))
  .use('/trending', require('./trending/index'));

module.exports = router;
