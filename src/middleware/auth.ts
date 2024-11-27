import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const tokenSecret = process.env.TOKEN ?? '';

const authenticate = (rq: Request, res: Response, next: NextFunction): void => {
    try {
        const authorizationHeader = rq.headers.authorization ?? '';
        const token = authorizationHeader.split(' ')[1];
        jwt.verify(token, tokenSecret);
        next();
    } catch (error) {
        res.status(400);
        res.send('Authenticate fail: ' + error)
        return
    }
}

export default authenticate;