import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from './entities/diary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity])],
  controllers: [],
  providers: [],
})
export class DiaryModule {}
