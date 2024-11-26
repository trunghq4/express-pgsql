import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";

dotenv.config();
const {BCRYPT_PASSWORD, SALT_ROUNDS, TOKEN} = process.env;
const pepper = BCRYPT_PASSWORD;
const saltRounds = SALT_ROUNDS;
const tokenSecret = TOKEN;

export const encryptPassword = (password: string) => {
    return bcrypt.hashSync(password + pepper, parseInt('' + saltRounds));
}

export const createToken = (user: User): string => {
    return jwt.sign({user}, ''+tokenSecret);
}