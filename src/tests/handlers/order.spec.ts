import { User } from '../../models/userModel';
import request from 'supertest';
import express from 'express';
import orderRoutes from '../../handlers/order';
import userRoutes from '../../handlers/user';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const tokenSecret = process.env.TOKEN ?? '';
const app = express();
app.use(express.json());
orderRoutes(app);
userRoutes(app);

const user2: User = {
    firstName: 'B',
    lastName: 'Tran',
    password: 'password123',
};

let token: string = '';

describe('Order Router', () => {
    describe('Get order by user', () => {
        beforeAll(async () => {
            const res = await request(app).post('/users/create').send(user2);
            token = res.body;
        });

        it('Authen fail, Missing token', async () => {
            const res = await request(app).get('/orders-by-user/:userId').send('0');
            expect(res.text).toContain('Authenticate fail');
            expect(res.status).toBe(401);
        });

        it('Authen fail, token miss match', async () => {
            const res = await request(app).get('/orders-by-user/:userId').set('Authorization', `Bearer ${token}`).send('0');
            expect(res.text).toContain('User id does not match');
            expect(res.status).toBe(401);
        });

        it('get order success', async () => {
            const decode = jwt.verify(token, tokenSecret);
            // @ts-ignore
            const userId = decode.user.id;
            const res = await request(app).get(`/orders-by-user/${userId}`).set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });

    });


});
