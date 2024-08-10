import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
// import * as morgan from 'morgan';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { WINSTON_CONFIG } from './config/logger.config';
import { setupSwagger } from './config/swagger.config';
import { ResponseInterceptor } from './common/interceptors/response.interceptors';
import { ValidationPipe } from '@nestjs/common';
import { EurekaClient } from './config/eureka.config';
import { ConfigService } from '@nestjs/config';
import { json } from 'body-parser';
import { ErrorFilter } from './common/filter/exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { validationOptions } from './config/validation.config';

async function bootstrap() {
  const winstonLogger = WinstonModule.createLogger(WINSTON_CONFIG);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: winstonLogger,
  });

  const configService: ConfigService = app.get(ConfigService);
  const env: string = configService.get<string>('NODE_ENV');
  const SERVER_PORT: number = configService.get<number>('PORT');

  app.set('trust proxy', true);

  // swagger setting
  setupSwagger(app);

  // cors settings
  const corsOptions: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  };
  app.enableCors(corsOptions);

  // use global pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // app.use(morgan('combined')) // product
  // app.use(morgan('dev')); // dev

  // use global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // exception filter 적용
  app.useGlobalFilters(new ErrorFilter(winstonLogger));

  // validation pipe setting
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  // payload size limit
  app.use(json({ limit: '10mb' }));

  // winston logger setting
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  try {
    await app.listen(SERVER_PORT);
    if (env === 'dev' || env === 'prod') {
      EurekaClient.logger.level('log');
      EurekaClient.start();
    }
    winstonLogger.log(`✅ Server is listening on port ${SERVER_PORT}`);
  } catch (e) {
    winstonLogger.error(e);
    winstonLogger.error('⛔️ Failed to start the app server');
  }
}

bootstrap();
