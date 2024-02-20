import { Module } from '@nestjs/common';
import { NestConfigModule } from './configs/config.module';
import { DatabaseModule } from './configs/database.module';
import { DiaryModule } from './apis/diaries/diary.module';

@Module({
  imports: [NestConfigModule, DatabaseModule, DiaryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
