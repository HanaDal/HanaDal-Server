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
        
        res.status(200).json(data);
    });
}

function writeQna(req, res) {
    let newQnA = new QnA();

    newQnA.tags = req.body.tags.split(',');
    newQnA.writer = req.body.writer;
    newQnA.content = req.body.content;
    newQnA.comment = [];

    console.log(newQnA);

    newQnA.save((err) => {
        if(err) {
            console.log(err);
            return res.status('500').json({
                result: 'failure'
            });
        }
        res.status(200).json({result: 'success'});
    });
}

exports.getQnas = getQnas;
exports.writeQna = writeQna;