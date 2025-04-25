import { Module } from '@nestjs/common';

import { UrlModule } from 'src/url/url.module';

import { IdentityModule } from 'src/infra/services/identity/identity.module';
import { AppConfigModule } from 'src/infra/config/config.module';

@Module({
  imports: [UrlModule, IdentityModule, AppConfigModule],
})
export class AppModule {}
