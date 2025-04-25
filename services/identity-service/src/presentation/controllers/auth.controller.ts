import { MessagePattern } from '@nestjs/microservices';
import {
  Post,
  Body,
  UsePipes,
  Controller,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { LoginDTO } from '../dto/login.dto';
import { RegisterDTO } from '../dto/register.dto';

import { LoginUserUseCase } from 'src/application/use-cases/login-user.usecase';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user.usecase';
import { ValidateUserTokenUseCase } from 'src/application/use-cases/validate-user-token.usecase';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUser: LoginUserUseCase,
    private readonly registerUser: RegisterUserUseCase,
    private readonly validateUserTokenUseCase: ValidateUserTokenUseCase,
  ) {}

  @MessagePattern({ cmd: 'validate_user_token' })
  public async validateUserToken(data: { token: string }) {
    const result = await this.validateUserTokenUseCase.execute(data.token);

    return result;
  }

  @Post('register')
  @ApiBody({ type: RegisterDTO })
  @ApiOperation({ summary: 'Register a new user.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async register(@Body() registerDTO: RegisterDTO) {
    const user = await this.registerUser.execute(registerDTO);

    return { id: user.id, email: user.email };
  }

  @Post('login')
  @ApiBody({ type: LoginDTO })
  @ApiOperation({ summary: 'Login a user.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async login(@Body() loginDTO: LoginDTO) {
    const result = await this.loginUser.execute(loginDTO);

    return result;
  }
}
