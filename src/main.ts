import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as morgan from 'morgan';
import { WinstonLogger } from './configs/winston.config';
import { SwaggerConfig } from './configs/swagger.config';
import { SwaggerModule } from '@nestjs/swagger';

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

  // app.use(morgan('combined')) // product
  app.use(morgan('dev')); // dev

  // run swagger
  const config = new SwaggerConfig().initializeOptions();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/diary/swagger', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  // run server
  try {
    await app.listen(port);
    WinstonLogger.log(`Server is listening on port ${port} successfully`);
    // console.log(`Server is listening on port ${port} successfully`);
  } catch (e) {
    WinstonLogger.error(e);
    WinstonLogger.error('Failed to start the app server');
  }
}

bootstrap();
