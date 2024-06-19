import { Module } from '@nestjs/common';
import { NestConfigModule } from '../config/config.module';
import { DatabaseModule } from '../config/database.module';
import { DiaryModule } from './diary/diary.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [NestConfigModule, DatabaseModule, DiaryModule, KafkaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
