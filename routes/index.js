const express = require('express');
const router = express.Router();

router.use('/qna', require('./qna/index'))
    .use('/docs', require('./docs/index'));