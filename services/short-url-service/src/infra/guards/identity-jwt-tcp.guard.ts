import { Request } from 'express';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { IdentityService } from '../services/identity/identity.service';

@Injectable()
export class IdentityJwtTcpGuard implements CanActivate {
  constructor(private readonly identityService: IdentityService) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Malformed or missing token!');
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      throw new UnauthorizedException('Malformed or missing token!');
    }

    const result = await this.identityService.validateUserToken(token);

    if (!result.isSuccess) {
      throw new UnauthorizedException(result.error.message);
    }

    if (result.isSuccess && result.value) {
      req.user = { id: result.value.userId, email: result.value.email };

      return true;
    }

    return false;
  }
}
