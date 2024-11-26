import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
    HOST,
    DB,
    USER,
    PASS
} = process.env;

const client = new Pool({
    host: HOST,
    database: DB,
    user: USER,
    password: ''+PASS
})

export default client;