import request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpStatus, INestApplication, INestMicroservice } from '@nestjs/common';
import { Transport, ClientProxy, ClientProxyFactory } from '@nestjs/microservices';

import { IUserRepository } from '@domain/repositories/user.repository';

import { AuthModule } from '@presentation/auth.module';
import { RegisterUserDTO } from '@presentation/dto/register.dto';

import { DatabaseModule } from '@infra/database/database.module';
import { AppConfigModule } from '@infra/config/config.module';

import { Result } from '@application/result';
import { USER_REPOSITORY } from '@application/constants';
import { IdentityAuthPayload } from '@application/use-cases/validate-user-token.usecase';

let userId: string | null = null;
let userJwtToken: string | null = null;
const userToRegister: RegisterUserDTO = {
  email: 'test@test.com',
  password: 'testpass123',
};

describe('AuthController', () => {
  let app: INestApplication;
  let microApp: INestMicroservice;
  let jwtService: JwtService;

  let userRepo: IUserRepository;
  let identityClient: ClientProxy;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, DatabaseModule, AppConfigModule],
    }).compile();

    app = moduleRef.createNestApplication();
    userRepo = moduleRef.get<IUserRepository>(USER_REPOSITORY);
    jwtService = moduleRef.get<JwtService>(JwtService);

    const configService = app.get(ConfigService);

    microApp = moduleRef.createNestMicroservice({
      options: {
        host: configService.get('api.HOST_IDENTITY_TCP'),
        port: configService.get('api.PORT_IDENTITY_TCP'),
      },
      transport: Transport.TCP,
    });

    await microApp.listen();

    identityClient = ClientProxyFactory.create({
      options: {
        host: configService.get<string>('api.HOST_IDENTITY_TCP'),
        port: configService.get<number>('api.PORT_IDENTITY_TCP'),
      },
      transport: Transport.TCP,
    });

    await app.init();
    await identityClient.connect();
  });

  afterAll(async () => {
    if (userId) {
      await userRepo.delete(userId);
    }

    await identityClient.close();

    await app.close();
    await microApp.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user.', async () => {
      const { body, status } = await request(app.getHttpServer()).post('/auth/register').send(userToRegister);

      expect(status).toBe(HttpStatus.CREATED);

      expect(body).toHaveProperty('id', expect.any(String));
      expect(body.email).toBe(userToRegister.email);

      userId = body.id;
    });

    it('should throw exception if user already registered.', async () => {
      const response = await request(app.getHttpServer()).post('/auth/register').send(userToRegister).expect(400);

      expect(response.body).toStrictEqual({
        error: 'Bad Request',
        message: 'A user with this email already exists.',
        statusCode: 400,
      });
    });
  });

  describe('POST /auth/login', () => {
    it('should login a registered user.', async () => {
      const { body, status } = await request(app.getHttpServer()).post('/auth/login').send(userToRegister);

      expect(status).toBe(HttpStatus.OK);
      expect(body).toHaveProperty('token', expect.any(String));

      userJwtToken = body.token;
    });

    it('should throw exception if user not exists.', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...userToRegister, email: 'testnotexists@test.com' })
        .expect(401);

      expect(response.body).toStrictEqual({
        error: 'Unauthorized',
        message: 'Invalid credentials.',
        statusCode: 401,
      });
    });

    it('should throw exception if user password is invalid.', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...userToRegister, password: 'invalidUserPassword' })
        .expect(401);

      expect(response.body).toStrictEqual({
        error: 'Unauthorized',
        message: 'Invalid credentials.',
        statusCode: 401,
      });
    });
  });

  describe('GET /auth/profile', () => {
    it('should get a registered user profile.', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${userJwtToken}`);

      expect(status).toBe(HttpStatus.OK);
      expect(body.email).toBe(userToRegister.email);
    });
  });

  describe('TCP command: validate_user_token', () => {
    it('should validate a user token successfully.', async () => {
      const result = await firstValueFrom<Result<IdentityAuthPayload>>(
        identityClient.send({ cmd: 'validate_user_token' }, { token: userJwtToken }),
      );

      expect(result.value).toStrictEqual({
        email: userToRegister.email,
        userId,
      });
    });

    it('should throw exception if token is invalid.', async () => {
      const result = await firstValueFrom<Result<IdentityAuthPayload>>(
        identityClient.send({ cmd: 'validate_user_token' }, { token: 'invalidUserJwtToken' }),
      );

      expect(result.value).toBeUndefined();
      expect(result.isSuccess).toBe(false);

      expect(result.error).toStrictEqual({
        status: 401,
        message: 'User not found or inactive!',
      });
    });

    it('should throw exception if token return a invalid user.', async () => {
      jest.spyOn(userRepo, 'findById').mockImplementation(async (id: string) => null);

      const nonExistentUserToken = await jwtService.signAsync({
        sub: 'non-existent-id',
        email: userToRegister.email,
      });

      const result = await firstValueFrom<Result<IdentityAuthPayload>>(
        identityClient.send({ cmd: 'validate_user_token' }, { token: nonExistentUserToken }),
      );

      expect(userRepo.findById).toHaveBeenCalledWith('non-existent-id');

      expect(result.value).toBeUndefined();
      expect(result.isSuccess).toBe(false);

      expect(result.error).toStrictEqual({
        status: 401,
        message: 'User not found or inactive!',
      });
    });
  });
});
