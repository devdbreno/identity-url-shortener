import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ShortCodeValidationPipe implements PipeTransform {
  private readonly regex = /^[a-zA-Z0-9]{1,6}$/;

  transform(value: string): string {
    if (!this.regex.test(value))
      throw new BadRequestException('Invalid urlShortCode format');

    return value;
  }
}
