import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { IdentityService } from './identity.service';

import { IdentityJwtTcpGuard } from 'src/infra/guards/identity-jwt-tcp.guard';
import { IdentityOptionalJwtTcpGuard } from 'src/infra/guards/identity-optional-jwt-tcp.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'IDENTITY_CLIENT',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('api.HOST_IDENTITY_TCP'),
            port: configService.get<number>('api.PORT_IDENTITY_TCP'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [IdentityService, IdentityJwtTcpGuard, IdentityOptionalJwtTcpGuard],
  providers: [IdentityService, IdentityJwtTcpGuard, IdentityOptionalJwtTcpGuard],
})
export class IdentityModule {}
