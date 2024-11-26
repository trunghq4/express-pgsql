import client from "../database";

export type Product = {
    id?: number,
    name: string,
    price: number,
    category: String
}

export class ProductModel {
    async index(): Promise<Product[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM "product"';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }

    async show(id: number): Promise<Product> {
        try {
            const sql = 'SELECT * FROM "product" WHERE id=($1)'
            const conn = await client.connect()
            const result = await conn.query(sql, [id])
            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }

    async create(prod: Product): Promise<Product> {
        try {
            const sql = 'INSERT INTO "product" (name, price, category) VALUES($1, $2, $3) RETURNING *'
            const conn = await client.connect()

            const result = await conn.query(sql, [prod.name, prod.price, prod.category])

            const newProd = result.rows[0]

            conn.release()

            return newProd
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }
}
