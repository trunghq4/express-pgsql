import express, { Request, Response } from "express";
import { User, UserModel } from "../models/userModel";
import * as Helper from "../utils/helpers";

const model = new UserModel();

const index = async (rq: Request, res: Response) => {
    const users = await model.index();
    res.json(users);
}

const create = async (rq: Request, res: Response) => {
    try {
        const { firstName, lastName, password } = rq.body;
        if(!firstName || !lastName || !password){
            res.status(400);
            res.send('Missing data')
        }
        const userExists = await model.getUserByName(firstName, lastName);
        if (userExists) {
            res.status(400).send('Duplicate user');
        }
        const user: User = {
            firstName,
            lastName,
            password
        }
        const newUser = await model.create(user);
        const token = Helper.createToken(newUser);
        res.json(token);
    } catch (error) {
        throw new Error(`Error: ${error}`)
    }
}

const show = async (rq: Request, res: Response) => {
    try {
        const userId: number = parseInt(rq.params.userId);
        const user: User = await model.show(userId);
    
        res.json(user);
    } catch (error) {
        throw new Error(`Error: ${error}`)
    }

}

const userRoutes = (app: express.Application) => {
    app.get('/users', index);
    app.post('/users', create);
    app.get('/users/:userId/details', show);
}

export default userRoutes;