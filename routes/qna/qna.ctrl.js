const QnA = require('../../model/qna');

function getQnas(req, res) {
    res.status(200).json({title: 'hello'});
}

function writeQna(req, res) {
    let newQnA = new QnA();
    newQnA.tags = req.body.tags.split(',');
    newQnA.writer = req.body.writer;
    newQnA.content = req.body.content;
    newQnA.coment = [];

    res.status(200).json({result: 'success'});
}

exports.getQnas = getQnas;
exports.writeQna = writeQna;