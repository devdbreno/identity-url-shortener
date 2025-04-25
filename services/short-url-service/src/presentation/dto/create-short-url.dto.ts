import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsNotEmpty } from 'class-validator';

export class CreateShortUrlDTO {
  @ApiProperty({
    example: 'https://example.com',
    description: 'The original URL to be shortened.',
  })
  @IsUrl({}, { message: `The value of 'origin' must be a valid URL!` })
  @IsNotEmpty({ message: `The value of 'origin' cannot be empty!` })
  origin: string;
}
