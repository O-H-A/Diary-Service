import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as morgan from 'morgan';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors settings
  const corsOptions: CorsOptions = {
    credentials: true,
  };
  app.enableCors(corsOptions);

  // app.use(morgan('combined')) // product
  app.use(morgan('dev')); // dev

  // run server
  try {
    await app.listen(port);
    console.log(`Server is listening on port ${port} successfully`);
  } catch (e) {
    console.error(e);
  }
}

bootstrap();
