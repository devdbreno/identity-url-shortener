import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { IdentityJwtTcpGuard } from './identity-jwt-tcp.guard';

@Injectable()
export class IdentityOptionalJwtTcpGuard implements CanActivate {
  constructor(private readonly authGuard: IdentityJwtTcpGuard) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'] as string;

    // Se não veio header, não valida e segue adiante sem req.user
    if (!authHeader) {
      return true;
    }

    const ok = await this.authGuard.canActivate(ctx);

    return ok;
  }
}
