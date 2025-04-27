import { Module } from '@nestjs/common';

import { UrlController } from 'src/presentation/controllers/url.controller';
import { URL_REPOSITORY } from 'src/application/constants';
import { IdentityModule } from 'src/infra/services/identity/identity.module';

import { UrlOrm } from 'src/infra/persistence/url.orm.entity';
import { UrlRepository } from 'src/infra/persistence/url.repository';
import { PersistenceModule } from 'src/infra/persistence/persistence.module';

import { ListUrlsUseCase } from 'src/application/use-cases/list-urls.usecase';
import { CreateShortUrlUseCase } from 'src/application/use-cases/create-short-url.usecase';
import { RedirectShortUrlUseCase } from 'src/application/use-cases/redirect-short-url.usecase';
import { SoftDeleteShortUrlUseCase } from 'src/application/use-cases/soft-delete-short-url.usecase';
import { UpdateShortUrlOriginUseCase } from 'src/application/use-cases/update-short-url-origin.usecase';

@Module({
  imports: [
    IdentityModule,
    PersistenceModule.forFeature([UrlOrm], [{ provide: URL_REPOSITORY, useClass: UrlRepository }]),
  ],
  providers: [
    ListUrlsUseCase,
    CreateShortUrlUseCase,
    RedirectShortUrlUseCase,
    SoftDeleteShortUrlUseCase,
    UpdateShortUrlOriginUseCase,
  ],
  controllers: [UrlController],
})
export class UrlModule {}
