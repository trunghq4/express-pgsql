import client from "../database";
import * as Helper from "../utils/helpers";

export type User = {
    id?: number,
    firstName: string,
    lastName: string,
    password: string
}

export class UserModel {
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM "user"';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }

    async show(id: number): Promise<User> {
        try {
            const sql = 'SELECT firstName, lastName FROM "user" WHERE id=($1)'
            const conn = await client.connect()
            const result = await conn.query(sql, [id])
            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }

    async create(u: User): Promise<User> {
        try {
            const passwd = Helper.encryptPassword(u.password);

            const sql = 'INSERT INTO "user" (firstName, lastName, password) VALUES($1, $2, $3) RETURNING *'
            const conn = await client.connect()

            const result = await conn.query(sql, [u.firstName, u.lastName, passwd])

            const user = result.rows[0]

            conn.release()

            return user
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }

    async delete(id: number): Promise<User> {
        try {
            const sql = 'DELETE FROM "user" WHERE id=($1)'
            // @ts-ignore
            const conn = await client.connect()

            const result = await conn.query(sql, [id])

            const user = result.rows[0]

            conn.release()

            return user
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }

    async getUserByName(firstName: string, lastName: string): Promise<boolean> {
        try {
            const abc = await this.index();

            const sql = 'SELECT COUNT(*) FROM "user" WHERE firstName = $1 AND lastName = $2';
            // @ts-ignore
            const conn = await client.connect()

            const result = await conn.query(sql, [firstName, lastName]);

            const count = result.rows[0].count;

            conn.release()

            return count > 0;
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }
}
