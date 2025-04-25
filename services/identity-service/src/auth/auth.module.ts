import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

// import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from './jwt-auth.guard';

import { AuthController } from 'src/presentation/controllers/auth.controller';

import { UserOrm } from 'src/infra/persistence/user.orm.entity';
import { UserRepository } from 'src/infra/persistence/user.repository';
import { PersistenceModule } from 'src/infra/persistence/persistence.module';

import { USER_REPOSITORY } from 'src/application/constants';
import { LoginUserUseCase } from 'src/application/use-cases/login-user.usecase';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user.usecase';
import { ValidateUserTokenUseCase } from 'src/application/use-cases/validate-user-token.usecase';

@Module({
  exports: [JwtAuthGuard, PassportModule, JwtModule, ValidateUserTokenUseCase],
  imports: [
    PersistenceModule.forFeature(
      [UserOrm],
      [{ provide: USER_REPOSITORY, useClass: UserRepository }],
    ),
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
  providers: [
    // JwtStrategy,
    JwtAuthGuard,
    LoginUserUseCase,
    RegisterUserUseCase,
    ValidateUserTokenUseCase,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
