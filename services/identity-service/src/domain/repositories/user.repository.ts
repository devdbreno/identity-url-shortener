import { User } from '../entities/user.entity';

export interface IUserRepository {
  delete(id: string): Promise<void>;
  create(user: Partial<User>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
