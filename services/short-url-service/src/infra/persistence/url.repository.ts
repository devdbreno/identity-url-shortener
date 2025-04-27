import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UrlOrm } from './url.orm.entity';

import { Url } from '../../domain/entities/url.entity';
import { IUrlRepository } from '../../domain/repositories/url.repository';

export class UrlRepository implements IUrlRepository {
  constructor(
    @InjectRepository(UrlOrm)
    private repo: Repository<UrlOrm>,
  ) {}

  async create(origin: string, shortCode: string, userId?: string) {
    const orm = this.repo.create({ origin, shortCode, userId });

    const saved = await this.repo.save(orm);

    return new Url(
      saved.id,
      saved.origin,
      saved.clicks,
      saved.userId,
      saved.shortCode,
      saved.createdAt,
      saved.updatedAt,
      saved.deletedAt,
    );
  }

  public async softDelete(id: string) {
    await this.repo.softDelete({ id });
  }

  public async incrementClicks(id: string) {
    await this.repo.increment({ id }, 'clicks', 1);
  }

  public async findByShortCode(code: string) {
    const found = await this.repo.findOne({ where: { shortCode: code } });

    if (!found) return null;

    return new Url(
      found.id,
      found.origin,
      found.clicks,
      found.userId,
      found.shortCode,
      found.createdAt,
      found.updatedAt,
      found.deletedAt,
    );
  }

  public async listByUser(userId: string) {
    const items = await this.repo.find({ where: { userId } });

    return items.map(
      (i) => new Url(i.id, i.origin, i.clicks, i.userId, i.shortCode, i.createdAt, i.updatedAt, i.deletedAt),
    );
  }

  public async updateOrigin(id: string, origin: string, userId: string, shortCode: string) {
    await this.repo.update({ id }, { origin, userId, shortCode });

    const found = await this.findByShortCodeAndUserId(shortCode, userId);

    return found;
  }

  public async findByShortCodeAndUserId(shortCode: string, userId: string) {
    const found = await this.repo.findOne({
      where: {
        userId,
        shortCode,
        deletedAt: null,
      },
    });

    if (!found) return null;

    return new Url(
      found.id,
      found.origin,
      found.clicks,
      found.userId,
      found.shortCode,
      found.createdAt,
      found.updatedAt,
      found.deletedAt,
    );
  }
}
