import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('identity_db.host'),
        port: configService.get<number>('identity_db.port'),
        username: configService.get<string>('identity_db.user'),
        password: configService.get<string>('identity_db.password'),
        database: configService.get<string>('identity_db.name'),
        entities: [__dirname + '/../persistence/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production',
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
