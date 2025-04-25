import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserOrm } from './user.orm.entity';

import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrm)
    private repo: Repository<UserOrm>,
  ) {}

  public async create(data: Partial<UserOrm>): Promise<User> {
    const orm = this.repo.create(data);
    const saved = await this.repo.save(orm);

    return new User(
      saved.id,
      saved.email,
      saved.passwordHash,
      saved.createdAt,
      saved.updatedAt,
    );
  }

  public async findByEmail(email: string): Promise<User | null> {
    const found = await this.repo.findOne({ where: { email } });

    if (!found) return null;

    return new User(
      found.id,
      found.email,
      found.passwordHash,
      found.createdAt,
      found.updatedAt,
    );
  }

  public async findById(id: string): Promise<User | null> {
    const found = await this.repo.findOne({ where: { id } });

    if (!found) return null;

    return new User(
      found.id,
      found.email,
      found.passwordHash,
      found.createdAt,
      found.updatedAt,
    );
  }
}
