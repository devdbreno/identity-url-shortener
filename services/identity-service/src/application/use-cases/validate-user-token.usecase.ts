import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';

import { Result } from '../result';
import { AppError } from '../error-types';
import { USER_REPOSITORY } from '../constants';

import { IUserRepository } from 'src/domain/repositories/user.repository';

export interface IdentityAuthPayload {
  userId: string;
  email: string;
}

@Injectable()
export class ValidateUserTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  public async execute(token: string) {
    const payload = await this.jwtService.verifyAsync<{
      sub: string;
      email: string;
    }>(token);

    try {
      const user = await this.userRepo.findById(payload.sub);

      if (!user || user.deletedAt) {
        return Result.fail<AppError>({
          status: 401,
          message: 'Usuário não encontrado ou inativo!',
        });
      }

      return Result.ok<IdentityAuthPayload>({
        email: payload.email,
        userId: payload.sub,
      });
    } catch (_err) {
      return Result.fail<AppError>({
        status: 401,
        message: 'Usuário não encontrado ou inativo!',
      });
    }
  }
}
