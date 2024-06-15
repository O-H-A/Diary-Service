import { Module } from '@nestjs/common';
import { NestConfigModule } from '../config/config.module';
import { DatabaseModule } from '../config/database.module';
import { DiaryModule } from './diary/diary.module';

@Module({
  imports: [NestConfigModule, DatabaseModule, DiaryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
