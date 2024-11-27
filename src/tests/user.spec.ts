import { UserModel, User } from '../models/userModel';
import client from '../database';
import * as Helper from '../utils/helpers';

describe('UserModel', () => {
    let userModel: UserModel;

    beforeEach(() => {
        userModel = new UserModel();
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

    // Test index method
    describe('UserModel Test', () => {
        it('Test list user', async () => {
            console.log('UserModel.index');
            
            const mockUsers: User[] = [
                { id: 1, firstName: 'A', lastName: 'Nguyen', password: 'password123' },
                { id: 2, firstName: 'B', lastName: 'Tran', password: 'password456' },
            ];

            mockClient.connect().query.and.returnValue({ rows: mockUsers });

            const result = await userModel.index();
            expect(result).toEqual(mockUsers);
            expect(mockClient.connect).toHaveBeenCalled();
            expect(mockClient.connect().release).toHaveBeenCalled();
        });
        it('Test show user', async () => {
            console.log('UserModel.show');
            const mockUser: User = { id: 1, firstName: 'A', lastName: 'Nguyen', password: 'password123' };

            mockClient.connect().query.and.returnValue({ rows: [mockUser] });

            const result = await userModel.show(1);
            expect(result).toEqual(mockUser);
            expect(mockClient.connect).toHaveBeenCalled();
            expect(mockClient.connect().release).toHaveBeenCalled();
        });
        it('create new user', async () => {
            console.log('UserModel.create');
            const newUser: User = { firstName: 'A', lastName: 'Nguyen', password: 'password123' };
            const mockCreatedUser: User = { id: 1, firstName: 'A', lastName: 'Nguyen', password: 'encryptedPassword123' };

            spyOn(Helper, 'encryptPassword').and.returnValue('encryptedPassword123');
            mockClient.connect().query.and.returnValue({ rows: [mockCreatedUser] });

            const result = await userModel.create(newUser);
            expect(result).toEqual(mockCreatedUser);
            expect(mockClient.connect).toHaveBeenCalled();
            expect(mockClient.connect().release).toHaveBeenCalled();
            expect(Helper.encryptPassword).toHaveBeenCalledWith('password123');
        });
        
        it('User exist', async () => {
            console.log('UserModel.getUserByName count > 0');
            mockClient.connect().query.and.returnValue({ rows: [{ count: 1 }] });

            const result = await userModel.getUserByName('A', 'Nguyen');
            expect(result).toBe(true);
            expect(mockClient.connect).toHaveBeenCalled();
            expect(mockClient.connect().release).toHaveBeenCalled();
        });

        it('User not found', async () => {
            console.log('UserModel.getUserByName count = 0');
            mockClient.connect().query.and.returnValue({ rows: [{ count: 0 }] });

            const result = await userModel.getUserByName('A', 'Nguyen');
            expect(result).toBe(false);
            expect(mockClient.connect).toHaveBeenCalled();
            expect(mockClient.connect().release).toHaveBeenCalled();
        });
    });
});
