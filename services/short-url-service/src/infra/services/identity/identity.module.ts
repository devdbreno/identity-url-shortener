import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { IdentityService } from './identity.service';

import { IdentityJwtTcpGuard } from 'src/infra/guards/identity-jwt-tcp.guard';
import { IdentityOptionalJwtTcpGuard } from 'src/infra/guards/identity-optional-jwt-tcp.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'IDENTITY_CLIENT',
        transport: Transport.TCP,
        options: {
          port: 4002,
          host: process.env.IDENTITY_SERVICE_HOST || 'localhost',
        },
      },
    ]),
  ],
  exports: [IdentityService, IdentityJwtTcpGuard, IdentityOptionalJwtTcpGuard],
  providers: [
    IdentityService,
    IdentityJwtTcpGuard,
    IdentityOptionalJwtTcpGuard,
  ],
})
export class IdentityModule {}
