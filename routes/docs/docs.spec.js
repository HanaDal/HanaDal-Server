const supertest = require('supertest');
const app = require('../../index');

describe('/docs', () => {
    describe('GET /', () => {
        it('Print Hello', done => {
            supertest(app)
                .get('/')
                .expect(200)
                .end(() => done());
        });
    });
});