import { Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

import { Result } from 'src/application/result';

@Catch(Result)
export class ResultExceptionFilter<T> implements ExceptionFilter {
  catch(exception: Result<T>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error = exception.error;

    response.status(error.status).json({
      status: 'error',
      message: error.message,
    });
  }
}
