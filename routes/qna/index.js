const express = require('express');
const router = express.Router();
const ctrl = require('./qna.ctrl');

router.get('/', ctrl.getQnas);
router.post('/', ctrl.writeQna);