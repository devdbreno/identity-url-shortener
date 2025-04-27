import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';

import { Result } from '../result';
import { USER_REPOSITORY } from '../constants';

import { IUserRepository } from '@domain/repositories/user.repository';

export interface IdentityAuthPayload {
  email: string;
  userId: string;
}

@Injectable()
export class ValidateUserTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  public async execute(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token);

      const user = await this.userRepo.findById(payload.sub);

      if (!user || user.deletedAt) {
        return Result.fail({
          status: 401,
          message: 'User not found or inactive!',
        });
      }

      return Result.ok<IdentityAuthPayload>({
        email: payload.email,
        userId: payload.sub,
      });
    } catch (_err) {
      return Result.fail({
        status: 401,
        message: 'User not found or inactive!',
      });
    }
  }
}
