import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorType } from './enum/error-type.enum';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = +exception.getStatus();

    const { message } = exception.getResponse() as {
      message: string | string[];
    };

    let { errorType } = exception.getResponse() as {
      errorType: ErrorType | string;
    };

    if (!errorType) {
      errorType = HttpStatus[status];
      errorType = errorType ? errorType : 'UNEXPECTED_ERROR';
    }

    response.status(status).json({
      errorType,
      message,
    });
  }
}
