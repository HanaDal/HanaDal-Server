const express = require('express');
const router = express.Router();

router.use(require('./qna/index'))
    .use(require('./docs/index'));