import { Request, Response } from 'express';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  Get,
  Req,
  Res,
  Post,
  Body,
  Param,
  Patch,
  UsePipes,
  UseGuards,
  Controller,
  ValidationPipe,
  Delete,
} from '@nestjs/common';

import { ShortCodeValidationPipe } from 'src/infra/pipes/shortcode-validation.pipe';

import { CreateShortUrlDTO } from '../dto/create-short-url.dto';
import { UpdateShortUrlOriginDTO } from '../dto/update-short-url-origin.dto';

import { IdentityJwtTcpGuard } from 'src/infra/guards/identity-jwt-tcp.guard';
import { IdentityOptionalJwtTcpGuard } from 'src/infra/guards/identity-optional-jwt-tcp.guard';

import { ListUrlsUseCase } from 'src/application/use-cases/list-urls.usecase';
import { CreateShortUrlUseCase } from 'src/application/use-cases/create-short-url.usecase';
import { RedirectShortUrlUseCase } from 'src/application/use-cases/redirect-short-url.usecase';
import { SoftDeleteShortUrlUseCase } from 'src/application/use-cases/soft-delete-short-url.usecase';
import { UpdateShortUrlOriginUseCase } from 'src/application/use-cases/update-short-url-origin.usecase';

@Controller()
export class UrlController {
  constructor(
    private readonly listUseCase: ListUrlsUseCase,
    private readonly redirectUrlUseCase: RedirectShortUrlUseCase,
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly softDeleteShortUrlUseCase: SoftDeleteShortUrlUseCase, // Novo caso de uso
    private readonly updateShortUrlOriginUseCase: UpdateShortUrlOriginUseCase,
  ) {}

  @Get(':urlShortCode')
  public async redirect(
    @Res() res: Response,
    @Param('urlShortCode', ShortCodeValidationPipe) urlShortCode: string,
  ) {
    const shortUrl = await this.redirectUrlUseCase.execute(urlShortCode);

    await this.redirectUrlUseCase.trackVisit(shortUrl.id);

    return res.redirect(302, shortUrl.origin);
  }

  @Get('short-urls')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lists URLs shortened by the user.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of shortened URLs.',
  })
  @UseGuards(IdentityJwtTcpGuard)
  public async listOwn(@Req() req: Request) {
    const result = await this.listUseCase.execute(req.user.id);

    return result;
  }

  @Post('short-urls')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Shortens a URL; associates it with the user if one exists.',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the shortened URL.',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @UseGuards(IdentityOptionalJwtTcpGuard)
  public async shorten(
    @Req() req: Request,
    @Body() { origin }: CreateShortUrlDTO,
  ) {
    return await this.createShortUrlUseCase.execute(origin, req.user?.id);
  }

  @Patch('short-urls/:urlShortCode')
  @ApiBody({ type: UpdateShortUrlOriginDTO })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Updates the origin URL of a shortened URL.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated shortened URL.',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @UseGuards(IdentityJwtTcpGuard)
  public async updateOrigin(
    @Req() req: Request,
    @Body() updateShortUrlOriginDTO: UpdateShortUrlOriginDTO,
    @Param('urlShortCode', ShortCodeValidationPipe) urlShortCode: string,
  ) {
    const updatedShortUrl = await this.updateShortUrlOriginUseCase.execute(
      req.user.id,
      urlShortCode,
      updateShortUrlOriginDTO,
    );

    return updatedShortUrl;
  }

  @Delete('short-urls/:urlShortCode')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletes a shortened URL.' })
  @ApiResponse({
    status: 200,
    description: 'The shortened URL has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Shortened URL not found or already deleted.',
  })
  @UseGuards(IdentityJwtTcpGuard)
  public async softDelete(
    @Req() req: Request,
    @Param('urlShortCode', ShortCodeValidationPipe) urlShortCode: string,
  ) {
    await this.softDeleteShortUrlUseCase.execute(req.user.id, urlShortCode);

    return { message: 'Shortened URL successfully deleted.' };
  }
}
