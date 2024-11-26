import client from "../database";

export type Order = {
    id?: number,
    status: number,
    user_id: number
};

export class OrderModel {
    async getCurrentOrderByUserId(userId: number): Promise<any[]> {
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM \"order\" O INNER JOIN order_product OP ON O.id = OP.id_order INNER JOIN product P ON OP.id_product = P.id WHERE O.user_id = $1";
            const result = await conn.query(sql, [userId]);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }
}