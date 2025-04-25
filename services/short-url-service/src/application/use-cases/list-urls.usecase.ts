import { Inject, Injectable } from '@nestjs/common';

import { URL_REPOSITORY } from '../constants';
import { IUrlRepository } from 'src/domain/repositories/url.repository';

@Injectable()
export class ListUrlsUseCase {
  constructor(
    @Inject(URL_REPOSITORY)
    private readonly urlRepo: IUrlRepository,
  ) {}

  public async execute(userId: string) {
    const result = await this.urlRepo.listByUser(userId);

    return result;
  }
}
