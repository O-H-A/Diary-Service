import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ReportInfoDto } from './dto/reportInfo.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryReportEntity } from 'src/entity/report/diary-report.entity';

@Injectable()
export class DiaryReportService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @InjectRepository(DiaryReportEntity)
    private readonly diaryReportRepository: Repository<DiaryReportEntity>,
  ) {}

  async createDiaryReport(reportingUserId: number, reportInfo: ReportInfoDto, transactionManager: EntityManager) {
    try {
      const newReport = new DiaryReportEntity();
      Object.assign(newReport, { reportingUserId, ...reportInfo });
      await transactionManager.save(newReport);
      return;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
