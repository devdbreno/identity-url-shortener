import { Request } from 'express';
import { MessagePattern } from '@nestjs/microservices';
import {
  Req,
  Get,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Controller,
  ValidationPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { JwtAuthGuard } from '@infra/guards/jwt-auth.guard';

import { RegisterUserDTO } from '@presentation/dto/register.dto';

import { LoginUserUseCase } from '@application/use-cases/login-user.usecase';
import { RegisterUserUseCase } from '@application/use-cases/register-user.usecase';
import { ValidateUserTokenUseCase } from '@application/use-cases/validate-user-token.usecase';
import { LoginDTO } from '@presentation/dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUser: LoginUserUseCase,
    private readonly registerUser: RegisterUserUseCase,
    private readonly validateUserToken: ValidateUserTokenUseCase,
  ) {}

  @MessagePattern({ cmd: 'validate_user_token' })
  public async validateToken(data: { token: string }) {
    const result = await this.validateUserToken.execute(data.token);

    return result;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the authenticated user.' })
  public profile(@Req() req: Request) {
    return req.user;
  }

  @Post('register')
  @ApiBody({ type: RegisterUserDTO })
  @ApiOperation({ summary: 'Register a new user.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async register(@Body() registerDTO: RegisterUserDTO) {
    const user = await this.registerUser.execute(registerDTO);

    return { id: user.id, email: user.email };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDTO })
  @ApiOperation({ summary: 'Login a registered user.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged in.',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async login(@Body() loginDTO: LoginDTO) {
    const result = await this.loginUser.execute(loginDTO);

    return result;
  }
}
