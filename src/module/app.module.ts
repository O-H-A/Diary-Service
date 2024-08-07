import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { NestConfigModule } from '../config/config.module';
import { DatabaseModule } from '../config/database.module';
import { DiaryModule } from './diary/diary.module';
import { KafkaModule } from './kafka/kafka.module';
import { ReportModule } from './report/report.module';
import { WinstonModule } from 'nest-winston';
import { WINSTON_CONFIG } from 'src/config/logger.config';
import { HealthModule } from './health/health.module';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';

@Module({
  imports: [
    NestConfigModule,
    DatabaseModule,
    DiaryModule,
    ReportModule,
    KafkaModule,
    HealthModule,
    WinstonModule.forRoot(WINSTON_CONFIG),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
