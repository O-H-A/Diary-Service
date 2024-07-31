import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from '../../entity/report/report.entity';
import { DiaryReportController } from './report.controller';
import { DiaryReportService } from './report.service';
import { JwtStrategy } from '../../auth/strategies/jwt.access.strategy';
import { ReportReasonEntity } from '../../entity/report/reportReason.entity';
import { HttpModule } from '@nestjs/axios';
import { DiaryEntity } from '../../entity/diary/diary.entity';
import { ConsumerService } from '../kafka/kafka.consumer.service';
import { ProducerService } from '../kafka/kafka.producer.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity, ReportReasonEntity, DiaryEntity]), HttpModule.register({})],
  controllers: [DiaryReportController],
  providers: [DiaryReportService, JwtStrategy, Logger, ProducerService, ConsumerService],
  exports: [ConsumerService, ProducerService],
})
export class ReportModule {}
