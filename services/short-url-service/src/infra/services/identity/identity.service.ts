import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';

import { Result } from 'src/application/result';

interface IdentityAuthPayload {
  email: string;
  userId: string;
}

@Injectable()
export class IdentityService {
  constructor(
    @Inject('IDENTITY_CLIENT') private readonly identityClient: ClientProxy,
  ) {}

  public async validateUserToken(
    bearer: string,
  ): Promise<Result<IdentityAuthPayload>> {
    if (!bearer?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token malformatado!');
    }

    const token = bearer.slice(7);

    try {
      const result = await firstValueFrom(
        this.identityClient.send<Result<IdentityAuthPayload>>(
          { cmd: 'validate_user_token' },
          { token },
        ),
      );

      return result;
    } catch (_err) {
      return Result.fail({ status: 401, message: 'Erro de autenticação!' });
    }
  }
}
