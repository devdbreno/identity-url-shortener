import { hash } from 'bcryptjs';
import { Inject, Injectable, BadRequestException } from '@nestjs/common';

import { RegisterUserDTO } from 'src/presentation/dto/register.dto';
import { USER_REPOSITORY } from '../constants';

import { User } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class RegisterUserUseCase {
  constructor(@Inject(USER_REPOSITORY) private userRepo: IUserRepository) {}

  public async execute(registerDTO: RegisterUserDTO): Promise<User> {
    const existingUser = await this.userRepo.findByEmail(registerDTO.email);

    if (existingUser) {
      throw new BadRequestException('A user with this email already exists.');
    }

    const passwordHash = await hash(registerDTO.password, 10);

    const result = await this.userRepo.create({
      email: registerDTO.email,
      passwordHash,
    });

    return result;
  }
}
