import { Module } from "@nestjs/common";

import { AuthModule } from "src/auth/auth.module";
import { ConfigModule } from "src/infra/config/config.module";

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
