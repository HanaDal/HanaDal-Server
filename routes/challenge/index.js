const router = require('express').Router();
const ctrl = require('./challenge.ctrl');

router.get('/', ctrl.getChallengeList)
  .post('/', ctrl.makeChallenge)
  .get('/:id', ctrl.getChallengeDetail)
  .post('/:id/diary/:day', ctrl.postChallengeDiary)
  .post('/:id/todo/:day', ctrl.postChallengeTodo)
  .get('/:id/comment', ctrl.getChallengeComment)
  .post('/:id/comment', ctrl.postChallengeComment)
  .get('/:id/comment/:no', ctrl.getCommentDetail)
  .post('/:id/comment/:no', ctrl.postCommentAtChallenegeComment)
  .get('/:id/info', ctrl.getChallengeInfo)
  .put('/:id/info', ctrl.modifyChallengeInfo)
  .post('/:id/fork', ctrl.forkChallenge)
  .get('/book', ctrl.getBooks)
  .get('/book/:id', ctrl.getBookDetail)
  .use((req, res) => console.log('그냥 여까지 오는지 궁금해성...', res.headersSent));

module.exports = router;
