import app from '../../index';
import supertest from 'supertest';
const request = supertest(app);

describe('/healthz', () => {
    it('should return a 200 status code', async () => {
        const response = await request.get('/healthz');
        expect(response.status).toBe(503);
    });
});
