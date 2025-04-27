import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';

import { Result } from 'src/application/result';

interface IdentityAuthPayload {
  email: string;
  userId: string;
}

@Injectable()
export class IdentityService {
  constructor(@Inject('IDENTITY_CLIENT') private readonly identityClient: ClientProxy) {}

  public async validateUserToken(token: string) {
    try {
      const result = await firstValueFrom(
        this.identityClient.send<Result<IdentityAuthPayload>>({ cmd: 'validate_user_token' }, { token }),
      );

      return result;
    } catch (_err) {
      return Result.fail({
        status: 401,
        message: 'Erro de autenticação!',
      });
    }
  }
}
