import { hash } from 'bcryptjs';
import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY } from '../constants';

import { User } from 'src/domain/entities/user.entity';
import { RegisterDTO } from 'src/presentation/dto/register.dto';
import { IUserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class RegisterUserUseCase {
  constructor(@Inject(USER_REPOSITORY) private userRepo: IUserRepository) {}

  public async execute(registerDTO: RegisterDTO): Promise<User> {
    const passwordHash = await hash(registerDTO.password, 10);

    return this.userRepo.create({ email: registerDTO.email, passwordHash });
  }
}
