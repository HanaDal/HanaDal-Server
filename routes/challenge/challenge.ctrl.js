const jwt = require('jsonwebtoken');
const Challenge = require('../../model/challenge');
const Book = require('../../model/book');

const getChallengeList = async function getChallengeList(req, res) {
  try {
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const challenges = await Challenge.find({ author: payload.id })
      /* .populate('author') */.select('_id tags pictureUrl name achievementRate' /* author.name author.picture author.cheering */);
    res.status(200).json(challenges);
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};

const makeChallenge = function makeChallenge(req, res) {
  try {
    const {
      title, description, isPublic, isStrict, tags,
    } = req.body;
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const newChallenge = new Challenge({
      author: payload.id,
      name: title,
      description,
      isPublic,
      isStrict,
      tags: tags.split(','),
    });

    newChallenge.save();
    res.status(201).json({ result: 'success' });
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};

const getChallengeDetail = function getChallengeDetailWithJWT(req, res) {
  try {
    const { id } = req.params;
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const challenge = Challenge.findById(id);
    if (challenge === null) return res.status(404).json({ result: 'failure' });
    return res.status(200).json({
      result: 'success',
      _id: challenge._id,
      isMine: challenge.author === payload.id,
      day: challenge.todo.length,
      diary: challenge.diary,
      todo: challenge.todo,
    });
  } catch (e) {
    return res.status(403).json({ result: 'failure' });
  }
};

const postChallengeDiary = async function postChallengeDiaryWithJWT(req, res) {
  try {
    const { id, day } = req.params;
    const { title, content } = req.body;
    const challenge = await Challenge.findByIdAndUpdate(id, { $set: { [`diary.${day}`]: { title, content } } });
    if (challenge === null) return res.status(404).json({ result: 'failure' });
    return res.status(200).json({ result: 'success' });
  } catch (e) {
    return res.status(403).json({ result: 'failure' });
  }
};

const postChallengeTodo = async function postChallengeDiaryWithId(req, res) {
  const { id, day } = req.params;
  const { content } = req.body;

  const challenge = await Challenge.findByIdAndUpdate(id, { $set: { [`todo.${day}`]: { content } } });
  if (challenge === null) return res.status(404).json({ result: 'failure' });
  return res.status(201).json({ result: 'success' });
};

const getChallengeComment = function getChallengeCommentWithId(req, res) {
  const { id } = req.params;
  const comments = Challenge.findById(id).select('issue.author issue.title issue.comment').populate('issue.author');
  comments.forEach((e) => {
    e.comment = e.comment.length;
  });
  res.status(200).json(comments);
};

const postChallengeComment = async function postChallengeCommentWithJWT(req, res) {
  try {
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const { id } = req.params;
    const { title, content } = req.body;

    const challenge = await Challenge.findByIdAndUpdate(id, {
      $push: {
        issue: {
          author: payload.id, title, content, comment: [],
        },
      },
    });
    if (challenge === null) return res.status(404).json({ result: 'failure' });
    return res.status(201).json({ result: 'success' });
  } catch (e) {
    return res.status(403).json({ result: 'failure' });
  }
};

// TODO: tags가 없어요, comment가 comment에요 안드로이드랑 맞춰야 해요
const getCommentDetail = async function getCommentDetailWithId(req, res) {
  const { id, no } = req.params;

  // FIXME: array에서 특정 인덱스만 찾는법??
  // const challenge = await Challenge.find({ _id: id, 'issue.$': no }).populate('author comment.author');
  if (challenge === null) return res.status(404).json({ result: 'failure' });
  return res.status(200).json({ result: 'success' });
};

const postCommentAtChallenegeComment = async function postCommentAtChallenegeCommentWithJWT(req, res) {
  try {
    const { id, no } = req.params;
    const { content } = req.body;
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    // FIXME: array에서 특정 인덱스의 필드만 수정하는법??
    // const challenge = await Challenge.findOneAndUpdate({ _id: id, 'issue.$': no }, { $push: });
    return res.status(201).json({ result: 'success' });
  } catch (e) {
    return res.status(403).json({ result: 'failure' });
  }
};

const getChallengeInfo = async function getChallengeInfoWithId(req, res) {
  const { id } = req.params;
  const challenge = await Challenge.findById(id).select('name description tags author').populate('author');
  if (challenge === null) return res.status(404).json({ result: 'failure' });
  return res.status(200).json(challenge);
};

const modifyChallengeInfo = async function modifyChallengeInfoWithJWT(req, res) {
  try {
    const { id } = req.params;
    const { title, description, tags } = req.body;
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const challenge = await Challenge.findById(id);

    if (challenge.author !== payload.id) return res.status(403).json({ result: 'failure' });
    if (challenge === null) return res.status(404).json({ result: 'failure' });
    await Challenge.findByIdAndUpdate(id, { name: title, description, tags: tags.split(',') });

    return res.status(200).json({ result: 'success' });
  } catch (e) {
    return res.status(403).json({ result: 'failure' });
  }
};

const forkChallenge = async function forkChallenge(req, res) {
  try {
    const { id } = req.params;
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const challenge = await Challenge.findById(id).select('name description isPublic isStrict tags');
    if (challenge === null) return res.status(404).json({ result: 'failure' });
    const newChallenge = new Challenge({
      author: payload.id,
      name: challenge.name,
      description: challenge.description,
      isPublic: challenge.isPublic,
      isStrict: challenge.isStrict,
      tags: challenge.toString(),
    });
    newChallenge.save();
    return res.status(201).json({ result: 'success' });
  } catch (e) {
    return res.status(403).json({ result: 'failure' });
  }
};

const getBooks = async function getBooksWithJWT(req, res) {
  try {
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const books = await Book.find({ author: payload.id }).select('-content').populate('author');
    res.status(200).json(books);
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};

const getBookDetail = async function getBookDetailWithId(req, res) {
  const { id } = req.params;
  const book = await Book.findById(id).select('-_id').populate('author');
  res.status(200).json(book);
};

module.exports = {
  getChallengeList,
  makeChallenge,
  getChallengeDetail,
  postChallengeDiary,
  postChallengeTodo,
  getChallengeComment,
  postChallengeComment,
  getCommentDetail,
  postCommentAtChallenegeComment,
  getChallengeInfo,
  modifyChallengeInfo,
  forkChallenge,
  getBooks,
  getBookDetail,
};
