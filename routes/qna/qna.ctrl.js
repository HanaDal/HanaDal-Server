const jwt = require('jsonwebtoken');
const QnA = require('../../model/qna');

const getQnas = function getQnas(req, res) {
  QnA.find({}, '-content -comment').populate('author', 'name pictureUrl')
    .then(q => res.status(200).json(q))
    .catch(e => res.status(500).json({ result: 'failure', e }));
};


const writeQna = function writeQna(req, res) {
  try {
    const { title, tags, content } = req.body;
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const newQna = new QnA({
      author: payload.id, title, tags: tags.split(','), content, comment: [],
    });
    newQna.save()
      .then(() => res.status(201).json({ result: 'success' }))
      .catch(() => res.status(500).json({ result: 'failure' }));
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};


const deleteQna = function deleteQna(req, res) {
  try {
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    QnA.findOneAndDelete({ _id: req.params.id, author: payload.id })
      .then((result) => {
        if (result) res.status(200).json({ result: 'success' });
        else res.status(404).json({ result: 'success' });
      });
  } catch (e) { res.status(403).json({ result: 'failure' }); }
};


const getQnaDetail = async function getQnaDetail(req, res) {
  const qna = await QnA.findById(req.params.id).select('-_id -comment._id -comment.author._id -__v').populate('author', 'name pictureUrl').populate('comment.author', 'name pictureUrl');
  if (qna === null) {
    res.status(404).json({ result: 'failure' });
    return;
  }
  res.status(200).json(qna);
};


const writeQnaComment = function writeQnaComment(req, res) {
  try {
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    QnA.findByIdAndUpdate(req.params.id,
      {
        $push: { comment: { author: payload.id, content: req.body.content } },
        $inc: { answerCount: 1 },
      })
      .then(() => res.status(201).json({ result: 'success' }))
      .catch(() => res.status(500).json({ result: 'failure' }));
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};


const modifyQna = function modifyQna(req, res) {
  try {
    const { title, tags, content } = req.body;
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    QnA.findById(req.params.id)
      .then(async (q) => {
        if (q === null) return res.status(404).json({ result: 'failure' });
        if (q.author._id.toString() !== payload.id) return res.status(401).json({ result: 'failure' });
        await QnA.findByIdAndUpdate(req.params.id, {
          title: title || q.title,
          tags: tags || q.tags,
          content: content || q.content,
        });
        return res.status(200).json({ result: 'success' });
      })
      .catch(() => res.status(500).json({ result: 'failure' }));
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};

const getMyQuestion = async function getMyQuestionWithJWT(req, res) {
  try {
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const questions = await QnA
      .find({ author: payload.id }, '-content -comment')
      .populate('author', 'name pictureUrl');
    res.status(200).json(questions);
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};

const getMyAnswer = async function getMyAnswerWithJWT(req, res) {
  try {
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const questions = await QnA
      .find({ comment: { $elemMatch: { author: payload.id } } }, '-content -comment')
      .populate('author', 'name pictureUrl');
    res.status(200).json(questions);
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};

module.exports = {
  getQnas,
  writeQna,
  deleteQna,
  getQnaDetail,
  writeQnaComment,
  modifyQna,
  getMyQuestion,
  getMyAnswer,
};
