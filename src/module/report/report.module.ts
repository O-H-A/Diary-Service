import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryReportEntity } from '../../entity/report/diary-report.entity';
import { DiaryReportController } from './report.controller';
import { DiaryReportService } from './report.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.access.strategy';
import { ReportReasonEntity } from 'src/entity/report/reportReason.entity';
import { HttpModule } from '@nestjs/axios';
import { DiaryEntity } from 'src/entity/diary/diary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryReportEntity, ReportReasonEntity, DiaryEntity]), HttpModule.register({})],
  controllers: [DiaryReportController],
  providers: [DiaryReportService, JwtStrategy, Logger],
})
export class ReportModule {}
