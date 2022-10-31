import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('class AuthService', () => {
  let authService: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create a fake copy of usersService
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const foundUsers = users.filter((user) => user.email === email);
        return Promise.resolve(foundUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: users.length + 1, email, password } as User;

        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(authService).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const email = 'test@test.com';
    const password = '12345';

    const user = await authService.signup(email, password);

    const [salt, hash] = user.password.split('.');

    expect(user.email).toBeDefined();
    expect(user.password).not.toBe(password);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    const email = 'test@test.com';
    const password = '12345';

    await authService.signup(email, password);

    try {
      await authService.signup(email, password);
    } catch (exception) {
      expect(exception).toBeInstanceOf(BadRequestException);
    }
  });

  it('throws if signin is called with an unused email', async () => {
    const email = 'test@test.com';
    const password = '12345';
    try {
      await authService.signin(email, password);
    } catch (exception) {
      expect(exception).toBeInstanceOf(NotFoundException);
    }
  });

  it('throws if sigin is called with incorrect password', async () => {
    const email = 'test@test.com';
    const correctPassword = '12345';
    const incorrectPassword = 'flkaslsad';

    await authService.signup(email, correctPassword);

    try {
      await authService.signin(email, incorrectPassword);
    } catch (exception) {
      expect(exception).toBeInstanceOf(BadRequestException);
    }
  });

  it('returns a user if signin is called with correct email and password', async () => {
    const email = 'test@test.com';
    const password = '12345';

    await authService.signup(email, password);
    const user = await authService.signin(email, password);

    expect(user).toBeDefined();
  });
});
