import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    minLength: 6,
    description: 'The password of the user.',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
