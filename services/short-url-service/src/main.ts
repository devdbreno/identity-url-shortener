import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './presentation/app.module';
import { ResultExceptionFilter } from './infra/filters/result-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Short URL')
    .setDescription('API para encurtamento de URLs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalFilters(new ResultExceptionFilter());

  await app.listen(configService.get<number>('api.PORT_SHORT_URL'));
}

void bootstrap();
