const express = require('express');
const router = express.Router();
const ctrl = require('./qna.ctrl');

router.get('/', ctrl.getQnas);
router.post('/', ctrl.writeQna);
router.delete('/:id', ctrl.deleteQna);
router.get('/:id', ctrl.getQnaDetail);

module.exports = router;