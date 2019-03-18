const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');
const Challenge = require('../../model/challenge');
const Book = require('../../model/book');

const s3 = new aws.S3();

const getChallengeList = async function getChallengeList(req, res) {
  try {
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const challenges = await Challenge.find({ author: payload.id }, '_id tags pictureUrl name achievementRate')
      .populate('author', 'name pictureUrl');
    res.status(200).json(challenges);
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};

const makeChallenge = async function makeChallenge(req, res) {
  try {
    const {
      title, description, isPublic, isStrict, tags,
    } = req.body;
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const key = payload.id + title.replace(/"/g, '') + Date.now();
    let s3Promise = Promise.resolve();

    const newChallenge = new Challenge({
      author: payload.id,
      name: title.replace(/"/g, ''),
      description: description.replace(/"/g, ''),
      isPublic,
      isStrict,
      tags: tags.replace(/"/g, '').split(','),
    });

    if (req.file) {
      newChallenge.pictureUrl = `https://s3.amazonaws.com/hanadal-server/${key}`;
      s3Promise = s3.putObject({
        Bucket: 'hanadal-server',
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      }).promise();
    }

    await Promise.all([newChallenge.save(), s3Promise]);
    res.status(201).json({ result: 'success' });
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};

const getChallengeDetail = async function getChallengeDetailWithJWT(req, res) {
  try {
    const { id } = req.params;
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const challenge = await Challenge.findById(id);
    if (challenge === null) return res.status(404).json({ result: 'failure' });
    return res.status(200).json({
      result: 'success',
      _id: challenge._id,
      isMine: challenge.author.toString() === payload.id,
      isStrict: challenge.isStrict,
      day: challenge.diary.length,
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

  const challenge = await Challenge.findByIdAndUpdate(id, { $set: { [`todo.${day}`]: content } });
  if (challenge === null) return res.status(404).json({ result: 'failure' });
  return res.status(201).json({ result: 'success' });
};

const getChallengeComment = async function getChallengeCommentWithId(req, res) {
  const { id } = req.params;
  const challenge = await Challenge.findById(id).select('tags issue.author issue.title issue.comment').populate('issue.author', 'name pictureUrl');
  res.status(200).json(challenge.issue.map(element => ({
    tags: challenge.tags,
    author: element.author,
    title: element.title,
    answerCount: element.comment.length,
  })));
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
    console.log(e);
    return res.status(403).json({ result: 'failure' });
  }
};

const getCommentDetail = async function getCommentDetailWithId(req, res) {
  const { id, no } = req.params;

  const challenge = await Challenge.findById(id, { issue: { $slice: [Number(no), 1] } })
    .populate('issue.author issue.comment.author', 'name pictureUrl');
  if (challenge === null) return res.status(404).json({ result: 'failure' });
  return res.status(200).json({
    result: 'success',
    title: challenge.issue[0].title,
    tags: challenge.tags,
    content: challenge.issue[0].content,
    author: challenge.issue[0].author,
    comment: challenge.issue[0].comment,
  });
};

const postCommentAtChallenegeComment = async function postComment(req, res) {
  try {
    const { id, no } = req.params;
    const { content } = req.body;
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    await Challenge.findByIdAndUpdate(id, {
      $push: {
        [`issue.${no}.comment`]: {
          author: payload.id,
          content,
        },
      },
    });
    return res.status(201).json({ result: 'success' });
  } catch (e) {
    return res.status(403).json({ result: 'failure' });
  }
};

const getChallengeInfo = async function getChallengeInfoWithId(req, res) {
  const { id } = req.params;
  const challenge = await Challenge.findById(id).select('name pictureUrl description tags author').populate('author', 'pictureUrl name');
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
      pictureUrl: challenge.pictureUrl,
      todo: challenge.todo,
      isPublic: challenge.isPublic,
      isStrict: challenge.isStrict,
      tags: challenge.tags,
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
    const books = await Book.find({ author: payload.id }, '-content').populate('author', 'name');
    res.status(200).json(books);
  } catch (e) {
    res.status(403).json({ result: 'failure', e });
  }
};

const getBookDetail = async function getBookDetailWithId(req, res) {
  const { id } = req.params;
  const book = await Book.findById(id).select('-_id').populate('author', 'name');
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
