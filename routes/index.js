const express = require('express');
const router = express.Router();

router.use('/qna', require('./qna/index'));
router.use('/docs', require('./docs/index'));

module.exports = router;