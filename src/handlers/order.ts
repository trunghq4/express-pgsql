import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OrderModel } from "../models/orderModel";
import authenticate from "../middleware/auth";

dotenv.config();

const model = new OrderModel();
const tokenSecret = process.env.TOKEN ?? '';

const getCurrentOrder = async (rq: Request, res: Response) => {
    const authorizationHeader = rq.headers.authorization ?? '';
    const token = authorizationHeader.split(' ')[1]
    
    const decoded = jwt.verify(token, tokenSecret)
    const userId = parseInt(rq.params.userId);
    
    // @ts-ignore
    if (decoded.user.id !== userId) {
        res.status(401);
        res.send('User id does not match!')
        return;
    }
    const products = await model.getCurrentOrderByUserId(userId);
    res.json(products);
}

const orderRoutes = (app: express.Application) => {
    app.get('/orders-by-user/:userId', authenticate, getCurrentOrder);
}

export default orderRoutes;