import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as morgan from 'morgan';
import { WinstonLogger } from './config/winston.config';
import { SwaggerConfig } from './config/swagger.config';
import { SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './interceptors/response.interceptors';
import { ValidationPipe } from '@nestjs/common';
import { EurekaClient } from './config/eureka.config';
import { json } from 'body-parser';


const env = process.env.NODE_ENV;
const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonLogger,
  });

  // cors settings
  const corsOptions: CorsOptions = {
    credentials: true,
  };
  app.enableCors(corsOptions);

  // use global pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // app.use(morgan('combined')) // product
  app.use(morgan('dev')); // dev

  // use global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  
  app.use(json({ limit: '10mb' }));

  // run swagger
  const config = new SwaggerConfig().initializeOptions();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/diary/swagger', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  // run server
  try {
    await app.listen(port);
    if (env === 'product') {
      EurekaClient.logger.level('log');
      EurekaClient.start();
    }
    WinstonLogger.log(`Server is listening on port ${port} successfully`);
  } catch (e) {
    WinstonLogger.error(e);
    WinstonLogger.error('Failed to start the app server');
  }
}

bootstrap();
