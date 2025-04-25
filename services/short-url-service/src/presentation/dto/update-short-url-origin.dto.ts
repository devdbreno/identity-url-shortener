import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsNotEmpty } from 'class-validator';

export class UpdateShortUrlOriginDTO {
  @ApiProperty({
    example: 'https://example.com',
    description: 'The new origin URL to update the short URL with.',
  })
  @IsUrl({}, { message: `The value of 'origin' must be a valid URL!` })
  @IsNotEmpty({ message: `The value of 'origin' cannot be empty!` })
  origin: string;
}
