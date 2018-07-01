const QnA = require('../../model/qna');

function getQnas(req, res) {
    let data = [];
    QnA.find((err, qnas) => {
        if(err) {
            return res.status('500').json({
                result: 'failure'
            });
        }
        
        qnas.forEach((qna) => {
            data.push({
                id: qna._id
            });
        });
    });
}

function writeQna(req, res) {
    let newQnA = new QnA();
    newQnA.tags = req.body.tags.split(',');
    newQnA.writer = req.body.writer;
    newQnA.content = req.body.content;
    newQnA.coment = [];

    newQnA.save((err) => {
        if(err) {
            return res.status('500').json({
                result: 'failure'
            });
        }
        res.status(200).json({result: 'success'});
    });
}

exports.getQnas = getQnas;
exports.writeQna = writeQna;