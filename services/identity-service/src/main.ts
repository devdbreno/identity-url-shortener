import { Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from '@presentation/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Identity Service')
    .setDescription('Authentication microservice')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  const _microservice = app.connectMicroservice({
    options: {
      host: '0.0.0.0',
      port: configService.get<number>('api.PORT_IDENTITY_TCP'),
    },
    transport: Transport.TCP,
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('api.PORT_IDENTITY'));
}

void bootstrap();
