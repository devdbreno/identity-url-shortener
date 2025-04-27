import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { USER_REPOSITORY } from '../constants';
import { LoginDTO } from 'src/presentation/dto/login.dto';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepo: IUserRepository,
    private jwtService: JwtService,
  ) {}

  public async execute(loginDTO: LoginDTO): Promise<{ token: string }> {
    const user = await this.userRepo.findByEmail(loginDTO.email);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isValid = await compare(loginDTO.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { email: user.email, sub: user.id };

    const token = await this.jwtService.signAsync(payload);

    return { token };
  }
}
