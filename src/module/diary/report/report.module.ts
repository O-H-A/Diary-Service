import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryReportEntity } from '../../../entity/report/diary-report.entity';
import { DiaryReportController } from './report.controller';
import { DiaryReportService } from './report.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryReportEntity])],
  controllers: [DiaryReportController],
  providers: [DiaryReportService],
})
export class ReportModule {}
