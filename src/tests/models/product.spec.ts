import { ProductModel, Product } from '../../models/productModel';
import client from '../../database';

describe('ProductModel', () => {
    let productModel: ProductModel;

    beforeEach(() => {
        productModel = new ProductModel();
    });

    // Mock database client
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

    // Test index method
    describe('index()', () => {
        it('get all product', async () => {
            const mockProducts: Product[] = [
                { id: 1, name: 'Product 1', price: 100, category: 'Category 1' },
                { id: 2, name: 'Product B', price: 150, category: 'Category 2' },
            ];

            mockClient.connect().query.and.returnValue({ rows: mockProducts });

            const result = await productModel.index();
            expect(result).toEqual(mockProducts);
            expect(mockClient.connect).toHaveBeenCalled();
            expect(mockClient.connect().release).toHaveBeenCalled();
            expect(mockClient.connect().query).toHaveBeenCalledWith('SELECT * FROM "product"');
        });
    });

    // Test show method
    describe('show()', () => {
        it('get product by id', async () => {
            const mockProduct: Product = { id: 1, name: 'Product 1', price: 100, category: 'Category 1' };
            const productId = 1;

            mockClient.connect().query.and.returnValue({ rows: [mockProduct] });

            const result = await productModel.show(productId);
            expect(result).toEqual(mockProduct);
            expect(mockClient.connect).toHaveBeenCalled();
            expect(mockClient.connect().release).toHaveBeenCalled();
            expect(mockClient.connect().query).toHaveBeenCalledWith('SELECT * FROM "product" WHERE id=($1)', [productId]);
        });
    });

    // Test create method
    describe('create()', () => {
        it('create new prod', async () => {
            const newProduct: Product = { id: 1, name: 'Product 1', price: 100, category: 'Category 1' };

            mockClient.connect().query.and.returnValue({ rows: [newProduct] });

            const result = await productModel.create(newProduct);
            expect(result).toEqual(newProduct);
            expect(mockClient.connect).toHaveBeenCalled();
            expect(mockClient.connect().release).toHaveBeenCalled();
            expect(mockClient.connect().query).toHaveBeenCalledWith(
                'INSERT INTO "product" (name, price, category) VALUES($1, $2, $3) RETURNING *',
                [newProduct.name, newProduct.price, newProduct.category]
            );
        });
    });
});
