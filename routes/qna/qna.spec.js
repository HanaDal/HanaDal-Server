const supertest = require('supertest');
const app = require('../../index');

describe('/api/qna', () => {
    describe('GET /', () => {
        describe('Success', () => {
            it('Get Qnas', done => {
                supertest(app)
                .get('/api/qna')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(() => done());
            });
        });
    });

    describe('POST /', () => {
        describe('Success', () => {
            it('Write QnA with correct params', done => {
                supertest(app)
                .post('/api/qna')
                .send({
                    tags: '공부,기타,등등',
                    title: '공부가 어려워요',
                    writer: 'Kim',
                    content: '공부가 너무 어려운데 어떻게 할까요'
                })
                .expect(201)
                .expect('Content-Type', /json/)
                .end(() => done());
            });
        });

        describe('Failure', () => {
            it('Write QnA without title', done => {
                supertest(app)
                .post('/api/qna')
                .send({
                    tags: '공부,기타,등등',
                    writer: 'Kim',
                    content: '공부가 너무 어려운데 어떻게 할까요'
                })
                .expect(400)
                .expect('Content-Type', /json/)
                .end(() => done());
            });
        });
    });

    describe('GET /:id', () => {
        describe('Success', () => {
            it('Get specific QnA', done => {
                supertest(app)
                .get('/api/qna/1')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(() => done());
            });
        });

        describe('Failure', () => {
            it('Try getting non-existent Qna', done => {
                supertest(app)
                .get('/api/qna/0')
                .expect(404)
                .end(() => done());
            });
        });
    });

    describe('PUT(Update) /:id', () => {
        describe('Success', () => {
            it('Success update', done => {
                supertest(app)
                .put('/api/qna/1')
                .send({
                    content: '공부가 조금 어려운데 어떻게 할까요'
                })
                .expect(204)
                .end(() => done());
            });
        });

        describe('Failure', () => {
            it('Try updating for non-existent Qna', done => {
                supertest(app)
                .put('/api/qna/1')
                .send({
                    content: '공부가 조금 어려운데 어떻게 할까요'
                })
                .expect(404)
                .end(() => done());
            });
        });
    });

    describe('DELETE /:id', () => {
        describe('Success', () => {
            it('Success delete', done => {
                supertest(app)
                .delete('/api/qna/1')
                .expect(200)
                .end(() => done());
            });
        });

        describe('Failure', () => {
            it('Try to delete non-existent Qna', done => {
                supertest(app)
                .delete('/api/qna/0')
                .expect(404)
                .end(() => done());
            });
        });
    });

    describe('POST /:id/comment', () => {
        describe('Success', () => {
            it('Success commenting', done => {
                supertest(app)
                .post('/api/qna/1/comment')
                .send({
                    writer: 'Kim',
                    content: '그냥 집중하세요;;'
                })
                .expect(201)
                .end(() => done());
            });
        });

        describe('Failure', () => {
            it('Try to comment non-existent Qna', done => {
                supertest(app)
                .post('/api/qna/0/comment')
                .send({
                    writer: 'Kim',
                    content: '그냥 집중하세요;;'
                })
                .expect(404)
                .end(() => done());
            });

            it('Try to comment without params', done => {
                supertest(app)
                .post('/api/qna/1/comment')
                .send({
                    writer: 'Kim'
                })
                .expect(400)
                .end(() => done());
            });
        });
    });
});