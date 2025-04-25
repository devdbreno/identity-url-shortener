import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import apiConfig from './api.config';
import databaseConfig from './db.config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env'],
      load: [apiConfig, databaseConfig],
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
