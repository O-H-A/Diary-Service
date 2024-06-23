import { Inject, Injectable, Logger, LoggerService, NotFoundException } from '@nestjs/common';
import { ReportInfoDto } from './dto/reportInfo.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryReportEntity } from 'src/entity/report/diary-report.entity';
import { ActionInfoDto } from './dto/actionInfo.dto';

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

  async updateDiaryReportAction(reportId: number, actionInfo: ActionInfoDto, transactionManager: EntityManager) {
    try {
      const report = await this.diaryReportRepository.findOne({ where: { reportId } });
      if (!report) {
        throw new NotFoundException('reportId에 해당하는 신고 정보가 없습니다');
      }
      const { actionCodes } = actionInfo;
      const actionDtm = new Date();

      await transactionManager.update(DiaryReportEntity, reportId, { actionCodes, actionDtm, isDone: true });
      return;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
