import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './controllers/auth.controller';

import { JwtStrategy } from '@infra/strategies/jwt.strategy';
import { JwtAuthGuard } from '@infra/guards/jwt-auth.guard';

import { UserOrm } from '@infra/persistence/user.orm.entity';
import { UserRepository } from '@infra/persistence/user.repository';
import { PersistenceModule } from '@infra/persistence/persistence.module';

import { USER_REPOSITORY } from '@application/constants';
import { LoginUserUseCase } from '@application/use-cases/login-user.usecase';
import { RegisterUserUseCase } from '@application/use-cases/register-user.usecase';
import { ValidateUserTokenUseCase } from '@application/use-cases/validate-user-token.usecase';

@Module({
  exports: [JwtAuthGuard, PassportModule, JwtModule, ValidateUserTokenUseCase],
  imports: [
    PersistenceModule.forFeature([UserOrm], [{ provide: USER_REPOSITORY, useClass: UserRepository }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('api.jwtSecret'),
        signOptions: {
          expiresIn: configService.get<string>('api.jwtExpiration'),
        },
      }),
    }),
  ],
  providers: [JwtStrategy, JwtAuthGuard, LoginUserUseCase, RegisterUserUseCase, ValidateUserTokenUseCase],
  controllers: [AuthController],
})
export class AuthModule {}
