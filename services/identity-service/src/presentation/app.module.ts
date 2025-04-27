import { Module } from '@nestjs/common';

import { AuthModule } from '@presentation/auth.module';
import { AppConfigModule } from 'src/infra/config/config.module';

@Module({
  imports: [AppConfigModule, AuthModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
