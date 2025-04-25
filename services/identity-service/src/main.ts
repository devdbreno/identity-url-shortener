import { Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './presentation/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Identity Service')
    .setDescription('Authentication microservice')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  // HTTP listener
  await app.listen(4000);

  // TCP microservice for validate token
  const microApp = app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: 4002 },
  });

  await microApp.listen();
}

bootstrap();
