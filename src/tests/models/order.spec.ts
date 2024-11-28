import { OrderModel } from '../../models/orderModel';
import client from '../../database';

describe('OrderModel', () => {
    let orderModel: OrderModel;

    beforeEach(() => {
        orderModel = new OrderModel();
    });

    let mockClient: any;

    beforeEach(() => {
        mockClient = {
            connect: jasmine.createSpy('connect').and.returnValue({
                query: jasmine.createSpy('query'),
                release: jasmine.createSpy('release')
            })
        };
        client.connect = mockClient.connect;
    });

    describe('getCurrentOrderByUserId()', () => {
        it('return order success', async () => {
            const userId = 1;
            const mockOrders = [
                {
                    id: 1,
                    status: 2,
                    user_id: 1,
                    product_name: 'Product A',
                    quantity: 2
                },
                {
                    id: 2,
                    status: 1,
                    user_id: 1,
                    product_name: 'Product B',
                    quantity: 3
                }
            ];

            mockClient.connect().query.and.returnValue({ rows: mockOrders });

            const result = await orderModel.getCurrentOrderByUserId(userId);
            expect(result).toEqual(mockOrders);
            expect(mockClient.connect).toHaveBeenCalled();
            expect(mockClient.connect().release).toHaveBeenCalled();
            expect(mockClient.connect().query).toHaveBeenCalledWith(
                "SELECT * FROM \"order\" O INNER JOIN order_product OP ON O.id = OP.id_order INNER JOIN product P ON OP.id_product = P.id WHERE O.user_id = $1",
                [userId]
            );
        });

        it('return empty order', async () => {
            const userId = 2;
            const mockEmptyOrders: any[] = [];

            mockClient.connect().query.and.returnValue({ rows: mockEmptyOrders });

            const result = await orderModel.getCurrentOrderByUserId(userId);
            expect(result).toEqual(mockEmptyOrders);
            expect(mockClient.connect).toHaveBeenCalled();
            expect(mockClient.connect().release).toHaveBeenCalled();
            expect(mockClient.connect().query).toHaveBeenCalledWith(
                "SELECT * FROM \"order\" O INNER JOIN order_product OP ON O.id = OP.id_order INNER JOIN product P ON OP.id_product = P.id WHERE O.user_id = $1",
                [userId]
            );
        });
    });
});
