import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { QueryFailedError } from 'typeorm';
import { extractIPv4 } from '../utils/utility';

@Catch(HttpException, QueryFailedError, Error)
export class ErrorFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  async catch(exception: HttpException | QueryFailedError | Error, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const timeStamp: string = new Date().toLocaleString('ko-KR');
    const clientIP: string = extractIPv4(request.ip);
    // const clientIP = request.headers['x-forwarded-for'];

    if (exception instanceof HttpException) {
      // 직접 정의한 HttpException 에러 처리
      const status: number = exception.getStatus();
      const err: string | object = exception.getResponse();
      const errReponse = typeof err === 'string' ? { message: err } : err;
      console.error('⛔️', exception);
      this.logger.error(`⛔️ (${clientIP}) ${exception.name}: ${exception.message}`);
      const errResponseBody: object = { ...errReponse, timeStamp, path: request.url };
      return response.status(status).json(errResponseBody);
    } else {
      // 알 수 없는 DB 혹은 Node 에러 처리
      const status: number = HttpStatus.INTERNAL_SERVER_ERROR;
      const message: string = exception instanceof QueryFailedError ? '데이터베이스 장애 발생' : '서버 장애 발생';
      console.error('⛔️', exception);
      this.logger.error(`⛔️ (${clientIP}) ${exception.name}: ${exception.message}`);
      const errResponseBody: object = { statusCode: status, message, timeStamp, path: request.url };
      return response.status(status).json(errResponseBody);
    }
  }
}
