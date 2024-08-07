import { Inject, Injectable, LoggerService, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { extractIPv4 } from '../utils/utility';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', async () => {
      const { ip, method, originalUrl, params, body, query }: Request = req;
      const ipv4: string = extractIPv4(ip);
      const { statusCode }: Response = res;
      const paramsValue: string = JSON.stringify(params);
      const bodyValue: string = JSON.stringify(body);
      const queryValue: string = JSON.stringify(query);
      if (statusCode >= 400) {
        this.logger.error(
          `(${ipv4}) Path: ${originalUrl}, Method: ${method}, Params: ${paramsValue}, Body: ${bodyValue}, Query: ${queryValue}`,
        );
      } else {
        this.logger.log(`${ipv4}, ${originalUrl}, ${method}, ${statusCode}`);
      }
    });
    next();
  }
}
