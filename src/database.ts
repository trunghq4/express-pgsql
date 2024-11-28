import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
    HOST,
    DB,
    DB_TEST,
    USER,
    PASS,
    NODE_ENV
} = process.env;

const databaseName = NODE_ENV === 'test' ? DB_TEST : DB;

const client = new Pool({
    host: HOST,
    database: databaseName,
    user: USER,
    password: ''+PASS
})


export default client;