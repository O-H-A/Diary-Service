import { Inject, Injectable, Logger, LoggerService, NotFoundException } from '@nestjs/common';
import { ReportInfoDto } from './dto/reportInfo.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryReportEntity } from 'src/entity/report/diary-report.entity';
import { ActionInfoDto } from './dto/actionInfo.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ReportReasonEnum } from './enum/enum';

@Injectable()
export class DiaryReportService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
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

  async getDiaryReportList(token: string, reasonCode: ReportReasonEnum, isDone: boolean) {
    try {
      const queryCondition: any = { where: {}, relations: { diaryIdRelation: true } };
      if (reasonCode) {
        queryCondition.where.reasonCode = reasonCode;
      }
      if (typeof isDone !== 'undefined') {
        queryCondition.where.isDone = isDone;
      }
      const diaryReportList = await this.diaryReportRepository.find(queryCondition);

      const accessToken = token;
      const headers = { Authorization: `Bearer ${accessToken}` };
      const updateDiaryReportList = await Promise.all(
        diaryReportList.map(async (diaryReport) => {
          const reportingUserId = diaryReport.reportingUserId;
          let apiUrl;
          if (process.env.NODE_ENV === 'dev') {
            apiUrl = `http://${process.env.HOST}:3000/api/user/specificuser/${reportingUserId}`;
          } else {
            apiUrl = `http://${process.env.Eureka_HOST}/api/user/specificuser/${reportingUserId}`;
          }
          const reportingUserInfoResponse = await lastValueFrom(this.httpService.get(apiUrl, { headers }));
          const reportingUserInfo = reportingUserInfoResponse.data.data;
          diaryReport['reportingUserIdRelation'] = reportingUserInfo;
          return diaryReport;
        }),
      );
      const finalDiaryReportList = await Promise.all(
        updateDiaryReportList.map(async (updateDiaryReport) => {
          const diaryWriterId = updateDiaryReport.diaryIdRelation.userId;
          let apiUrl;
          if (process.env.NODE_ENV === 'dev') {
            apiUrl = `http://${process.env.HOST}:3000/api/user/specificuser/${diaryWriterId}`;
          } else {
            apiUrl = `http://${process.env.Eureka_HOST}/api/user/specificuser/${diaryWriterId}`;
          }
          const diaryWriterInfoResponse = await lastValueFrom(this.httpService.get(apiUrl, { headers }));
          const diaryWriterInfo = diaryWriterInfoResponse.data.data;
          updateDiaryReport.diaryIdRelation['userIdRelation'] = diaryWriterInfo;
          return updateDiaryReport;
        }),
      );
      // return finalDiaryReportList;
      // 응답값 posting이랑 맞추기
      return finalDiaryReportList; // 추후 변경
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
