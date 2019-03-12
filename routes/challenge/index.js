const router = require('express').Router();
const multer = require('multer');
const ctrl = require('./challenge.ctrl');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', ctrl.getChallengeList)
  .post('/', upload.single('picture'), ctrl.makeChallenge)
  .get('/book', ctrl.getBooks)
  .get('/book/:id', ctrl.getBookDetail)
  .get('/:id', ctrl.getChallengeDetail)
  .post('/:id/diary/:day', ctrl.postChallengeDiary)
  .post('/:id/todo/:day', ctrl.postChallengeTodo)
  .get('/:id/comment', ctrl.getChallengeComment)
  .post('/:id/comment', ctrl.postChallengeComment)
  .get('/:id/comment/:no', ctrl.getCommentDetail)
  .post('/:id/comment/:no', ctrl.postCommentAtChallenegeComment)
  .get('/:id/info', ctrl.getChallengeInfo)
  .put('/:id/info', ctrl.modifyChallengeInfo)
  .post('/:id/fork', ctrl.forkChallenge);

module.exports = router;
