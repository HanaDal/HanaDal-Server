const Challenge = require('../../model/challenge');
const Qna = require('../../model/qna');

// FIXME: 정규표현식 수정하기
const search = async function searchWithQuery(req, res) {
  const { query } = req.query;
  const challenges = await Challenge
    .find({ name: new RegExp(`${query}`, 'i') }, '_id tags pictureUrl name achievementRate')
    .populate('author', 'name pictureUrl');
  const qnas = await Qna
    .find({ title: new RegExp(`${query}`, 'i') }, '-content -comment')
    .populate('author', 'name pictureUrl');
  res.status(200).json({
    result: 'success',
    challenges,
    qnas,
  });
};

module.exports = {
  search,
};
