const QnA = require('../../model/qna');

function getQnas(req, res) {
  const data = [];
  QnA.find((err, qnas) => {
    if (err) {
      return res.status('500').json({
        result: 'failure',
      });
    }

    qnas.forEach((qna) => {
      data.push({
        id: qna._id,
        title: qna.title,
        content: qna.content,
      });
    });

    return res.status(200).json(data);
  });
}

function writeQna(req, res) {
  let newQnA = new QnA();

  newQnA.tags = req.body.tags.split(',');
  newQnA.title = req.body.title;
  newQnA.writer = req.body.writer;
  newQnA.content = req.body.content;
  newQnA.comment = [];

  newQnA.save((err) => {
    if (err) return res.status('500').json({ result: 'failure' });
    return res.status(200).json({ result: 'success' });
  });
}

function deleteQna(req, res) {
  res.status(200).json({ result: 'success' });
}

function getQnaDetail(req, res) {
  res.status(200).json({});
}

exports.getQnas = getQnas;
exports.writeQna = writeQna;
exports.deleteQna = deleteQna;
exports.getQnaDetail = getQnaDetail;
