const supertest = require('supertest');
const app = require('../../index');

/* api/docs Test */
describe('/api/docs', () => {
    describe('GET /', () => {
        describe('Success', () => {
            it('Opening docs with correct key', done => {
                supertest(app)
                    .get('/api/docs?key=' + process.env.docsKey)
                    .expect(301)
                    .expect('Content-Type', /html/)
                    .end(() => done());
            });
        });

        describe('Failure', () => {
            it('Opening docs with wrong key', done => {
                supertest(app)
                    .get('/api/docs')
                    .expect(403)
                    .end(() => done());
            });
        });
    });

    describe('GET /api-spec.json', () => {
        describe('Success', () => {
            it('Get api-spec.json with correct key', done => {
                supertest(app)
                .get('/api/docs/api-spec.json?key=' + process.env.docsKey)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(() => done());
            });
        });

        describe('Failure', () => {
            it('Get api-spec.json with wrong key', done => {
                supertest(app)
                .get('/api/docs/api-spec.json')
                .expect(403)
                .end(() => done());
            });
        });
    });
});