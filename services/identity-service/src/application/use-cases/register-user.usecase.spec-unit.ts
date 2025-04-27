import { Test, TestingModule } from '@nestjs/testing';

import { IUserRepository } from '@domain/repositories/user.repository';

import { USER_REPOSITORY } from '@application/constants';
import { RegisterUserUseCase } from '@application/use-cases/register-user.usecase';
import { RegisterUserDTO } from '@presentation/dto/register.dto';
import { User } from '@domain/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('RegisterUserUseCase', () => {
  let userRepoMock: jest.Mocked<IUserRepository>;
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        {
          provide: USER_REPOSITORY,

          useValue: {
            create: jest.fn() as unknown as () => Promise<void>,
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    userRepoMock = module.get<IUserRepository>(USER_REPOSITORY) as jest.Mocked<IUserRepository>;
    registerUserUseCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
  });

  it('should be defined', () => {
    expect(registerUserUseCase).toBeDefined();
  });

  it('should register a user successfully.', async () => {
    const registerUserDTO: RegisterUserDTO = new RegisterUserDTO('test@mail.com', 'testpass');

    const registeredUser: User = new User('1', registerUserDTO.email, 'hashedpassword', new Date(), new Date(), null);

    userRepoMock.findByEmail.mockResolvedValueOnce(null);
    userRepoMock.create.mockResolvedValueOnce(registeredUser);

    const registerUserUseCase = new RegisterUserUseCase(userRepoMock);

    const result = await registerUserUseCase.execute(registerUserDTO);

    expect(result.email).toStrictEqual(registerUserDTO.email);
  });

  it('should throw exception if user already registered.', async () => {
    const registerUserDTO: RegisterUserDTO = {
      email: 'test@mail.com',
      password: 'testpass',
    };

    userRepoMock.findByEmail.mockResolvedValueOnce(
      new User('1', registerUserDTO.email, 'hashedpassword', new Date(), new Date(), null),
    );

    await expect(registerUserUseCase.execute(registerUserDTO)).rejects.toThrow(BadRequestException);
  });
});

// describe('AuthService', () => {

//     it('should sign in a user and return an access token', async () => {
//         const user = {
//             id: 1,
//             username: 'testuser',
//             password: 'password',
//         };

//         usersServiceMock.validateCredentials.mockResolvedValueOnce(user);
//         jwtServiceMock.signAsync.mockResolvedValueOnce('token');

//         const response = await authService.signIn('testuser', 'password');

//         expect(response).toEqual({ access_token: 'token' });
//     });

//     it('should throw an UnauthorizedException if the user cannot be signed in', async () => {
//         usersServiceMock.validateCredentials.mockResolvedValueOnce(null);

//         await expect(
//             authService.signIn('testuser', 'password'),
//         ).rejects.toThrowError(UnauthorizedException);
//     });

//     it('should sign up a user and return the user', async () => {
//         const user = {
//             id: 1,
//             username: 'testuser',
//             password: 'password',
//         };

//         usersServiceMock.create.mockResolvedValueOnce(user);

//         const response = await authService.signUp('testuser', 'password');

//         expect(response).toEqual(user);
//         expect(response.password).toBeUndefined();
//     });

//     it('should throw an InternalServerErrorException if the user cannot be signed up', async () => {
//         usersServiceMock.create.mockRejectedValueOnce(new Error());

//         await expect(
//             authService.signUp('testuser', 'password'),
//         ).rejects.toThrowError(Error);
//     });
// });
