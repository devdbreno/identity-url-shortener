import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

import apiConfig from './api.config';
import databaseConfig from './db.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env'],
      load: [apiConfig, databaseConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
