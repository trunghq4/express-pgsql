import { User } from '../../models/userModel';
import request from 'supertest';
import express from 'express';
import userRoutes from '../../handlers/user';

const app = express();
app.use(express.json());
userRoutes(app);

const user1: User = {
    firstName: 'A',
    lastName: 'Nguyen',
    password: 'password123',
};
let token: string = '';

describe('User Routes', () => {
    beforeEach(() => {
    });

    describe('Create user', () => {

        it('missing data', async () => {
            const userMissingData = {
                lastName: 'Nguyen',
                password: 'password123',
            }
            const res = await request(app).post('/users/create').send(userMissingData);
            expect(res.text).toContain('Missing data');
            expect(res.status).toBe(400);
        });

        it('create user success', async () => {
            const res = await request(app).post('/users/create').send(user1);
            expect(res.status).toBe(200)
            token = res.body;
        });

        it('duplicate user', async () => {
            const res = await request(app).post('/users/create').send(user1);
            expect(res.text).toContain('Duplicate');
            expect(res.status).toBe(400);
        });
    });

    describe('Show user', () => {

        it('Unauthen', async () => {
            const res = await request(app).get('/users').send(user1);
            expect(res.status).toBe(401);
            expect(res.text).toContain('Authenticate fail');

            const resShow = await request(app).get('/users/1').send(user1);
            expect(resShow.status).toBe(401);
            expect(resShow.text).toContain('Authenticate fail');
        });

        it('List users', async () => {
            const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`).send(user1);
            expect(res.status).toBe(200);
        });

        it('Show user', async () => {
            const res = await request(app).get('/users/1').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });
    });


});
