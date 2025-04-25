import { Request } from 'express';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { IdentityService } from '../services/identity/identity.service';

@Injectable()
export class IdentityJwtTcpGuard implements CanActivate {
  constructor(private readonly identityService: IdentityService) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token ausente!');
    }

    const result = await this.identityService.validateUserToken(authHeader);

    if (!result.isSuccess) {
      throw new UnauthorizedException(result.error.message);
    }

    req.user = { id: result.value.userId, email: result.value.email };

    return true;
  }
}
