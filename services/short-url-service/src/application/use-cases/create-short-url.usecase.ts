import { customAlphabet } from 'nanoid';
import { Inject, Injectable } from '@nestjs/common';

import { URL_REPOSITORY } from '../constants';
import { IUrlRepository } from '../../domain/repositories/url.repository';

const nanoid = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  6,
);

@Injectable()
export class CreateShortUrlUseCase {
  constructor(
    @Inject(URL_REPOSITORY) private readonly urlRepo: IUrlRepository,
  ) {}

  async execute(origin: string, userId?: string | null) {
    const shortCode = await this.generateUniqueShortCode();

    return await this.urlRepo.create(origin, shortCode, userId);
  }

  private async generateUniqueShortCode(): Promise<string> {
    let exists = true;
    let shortCode: string;

    while (exists) {
      shortCode = nanoid();

      const existing = await this.urlRepo.findByShortCode(shortCode);

      exists = !!existing;
    }

    return shortCode;
  }
}
