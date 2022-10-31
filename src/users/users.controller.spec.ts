import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve({ id, email: 'test@test.com' } as User),
      find: (email: string) => Promise.resolve([{ id: 1, email } as User]),
      update: () => Promise.resolve({ id: 1, email: 'test@test.com' } as User),
      remove: () => Promise.resolve({ id: 1, email: 'test@test.com' } as User),
    };

    fakeAuthService = {
      signup: (email, _) => Promise.resolve({ id: 1, email } as User),
      signin: (email, _) => Promise.resolve({ id: 1, email } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const email = 'test@test.com';
    const users = await controller.findAllUsers(email);
    expect(users.length).not.toBe(0);
    expect(users[0].email).toBe(email);
  });

  it('findUser returns a single user with the given id', async () => {
    const id = '1';
    const user = await controller.findUser(id);
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    const id = '1';
    fakeUsersService.findOne = () => Promise.resolve(null);

    try {
      await controller.findUser(id);
    } catch (exception) {
      expect(exception).toBeInstanceOf(NotFoundException);
    }
  });

  it('sign in should return a user and update session', async () => {
    const session: any = {};
    const user = await controller.signin(
      { email: 'test@test.com', password: '12345' },
      session,
    );
    expect(user).toBeDefined();
    expect(session.userId).toBe(1);
  });
});
