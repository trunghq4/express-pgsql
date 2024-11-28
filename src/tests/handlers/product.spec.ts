import { User } from '../../models/userModel';
import request from 'supertest';
import express from 'express';
import userRoutes from '../../handlers/user';
import productRoutes from '../../handlers/product';
import { Product } from '../../models/productModel';

const app = express();
app.use(express.json());
productRoutes(app);
userRoutes(app);

const userTest: User = {
    firstName: 'C',
    lastName: 'Le',
    password: 'password123',
};
const prodTest: Product = {
    name: 'product1',
    price: 100000,
    category: 'category1'
};
let token: string = '';
let productId: number;

describe('Product Routes', () => {
    
    beforeAll(async () => {
        const res = await request(app).post('/users/create').send(userTest);
        token = res.body;
    });

    describe('Create product', () => {
        it('Authen fail', async () => {
            const res = await request(app).post('/products/create').send(prodTest);
            expect(res.status).toBe(401);
            expect(res.text).toContain('Authenticate fail');
        });

        it('Missing data', async () => {
            const prodError = {
                price: 100000,
                category: 'category1'
            };
            const res = await request(app).post('/products/create').set('Authorization', `Bearer ${token}`).send(prodError);
            expect(res.status).toBe(400);
            expect(res.text).toContain('Missing data');
        });

        it('Create success', async () => {
            const res = await request(app).post('/products/create').set('Authorization', `Bearer ${token}`).send(prodTest);
            productId = res.body.id;
            expect(res.status).toBe(200);
        })
    })

    describe('Get product', () => {

        it('get list product', async () => {
            const res = await request(app).get('/products');
            expect(res.status).toBe(200);
        });

        it('get product detail', async () => {
            const res = await request(app).get(`/products/${productId}/details`);
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('product1');
            expect(res.body.price).toBe('100000.00');
            expect(res.body.category).toBe('category1');
        });
    });

});
