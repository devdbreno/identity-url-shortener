import { Url } from '../entities/url.entity';

export interface IUrlRepository {
  create(origin: string, shortCode: string, userId?: string): Promise<Url>;
  softDelete(id: string): Promise<void>;
  listByUser(userId: string): Promise<Url[]>;
  updateOrigin(id: string, origin: string, userId: string, shortCode: string): Promise<Url>;
  incrementClicks(id: string): Promise<void>;
  findByShortCode(shortCode: string): Promise<Url | null>;
  findByShortCodeAndUserId(shortCode: string, userId: string): Promise<Url | null>;
}
