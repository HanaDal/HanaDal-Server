const express = require('express');
const ctrl = require('./qna.ctrl');

const router = express.Router();

router.get('/', ctrl.getQnas)
  .post('/', ctrl.writeQna)
  .get('/my-question', ctrl.getMyQuestion)
  .get('/my-answer', ctrl.getMyAnswer)
  .get('/:id', ctrl.getQnaDetail)
  .post('/:id', ctrl.writeQnaComment)
//  .delete('/:id', ctrl.deleteQna)
  .put('/:id', ctrl.modifyQna);

module.exports = router;
