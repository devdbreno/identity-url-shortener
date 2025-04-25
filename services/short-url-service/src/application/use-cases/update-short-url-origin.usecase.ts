import { Inject } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';

import { URL_REPOSITORY } from '../constants';
import { IUrlRepository } from '../../domain/repositories/url.repository';
import { UpdateShortUrlOriginDTO } from 'src/presentation/dto/update-short-url-origin.dto';

@Injectable()
export class UpdateShortUrlOriginUseCase {
  constructor(
    @Inject(URL_REPOSITORY) private readonly urlRepo: IUrlRepository,
  ) {}

  public async execute(
    userId: string,
    shortCode: string,
    updateShortUrlOriginDTO: UpdateShortUrlOriginDTO,
  ) {
    const shortUrl = await this.urlRepo.findByShortCodeAndUserId(
      shortCode,
      userId,
    );

    if (!shortUrl || shortUrl.deletedAt) {
      throw new NotFoundException('URL encurtada não encontrada ou inativa!');
    }

    shortUrl.origin = updateShortUrlOriginDTO.origin;

    const shortUrlUpdated = await this.urlRepo.updateOrigin(
      shortUrl.id,
      updateShortUrlOriginDTO.origin,
    );

    return shortUrlUpdated;
  }
}
