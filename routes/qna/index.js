const express = require('express');
const ctrl = require('./qna.ctrl');

const router = express.Router();

router.get('/', ctrl.getQnas);
router.post('/', ctrl.writeQna);
router.delete('/:id', ctrl.deleteQna);
router.get('/:id', ctrl.getQnaDetail);

module.exports = router;
