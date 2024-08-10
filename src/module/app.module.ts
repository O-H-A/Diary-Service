import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DATABASE_CONFIG } from '../config/database.config';
import { DiaryModule } from './diary/diary.module';
import { KafkaModule } from './kafka/kafka.module';
import { ReportModule } from './report/report.module';
import { WinstonModule } from 'nest-winston';
import { WINSTON_CONFIG } from 'src/config/logger.config';
import { HealthModule } from './health/health.module';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(DATABASE_CONFIG),
    WinstonModule.forRoot(WINSTON_CONFIG),
    DiaryModule,
    ReportModule,
    KafkaModule,
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
