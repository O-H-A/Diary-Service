import { Inject, Injectable, Logger, LoggerService, NotFoundException } from '@nestjs/common';
import { ReportInfoDto } from './dto/reportInfo.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from '../../entity/report/report.entity';
import { ActionInfoDto } from './dto/actionInfo.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ReportReasonEnum } from './enum/enum';
import { DiaryEntity } from '../../entity/diary/diary.entity';
import { ProducerService } from '../kafka/kafka.producer.service';
import { ConsumerService } from '../kafka/kafka.consumer.service';
import { ProducerRecord } from 'kafkajs';
import { ReportReasonEntity } from '../../entity/report/reportReason.entity';

@Injectable()
export class DiaryReportService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    @InjectRepository(ReportEntity)
    private readonly diaryReportRepository: Repository<ReportEntity>,
    @InjectRepository(DiaryEntity)
    private readonly diaryRepository: Repository<DiaryEntity>,
    @InjectRepository(ReportReasonEntity)
    private readonly reportReasonRepository: Repository<ReportReasonEntity>,
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  async createDiaryReport(reportingUserId: number, reportInfo: ReportInfoDto, transactionManager: EntityManager) {
    try {
      const diary = await this.diaryRepository.findOne({ where: { diaryId: reportInfo.diaryId } });
      if (!diary) {
        throw new NotFoundException('신고할 다이어리가 존재하지 않습니다.');
      }
      const newReport = new ReportEntity();
      Object.assign(newReport, { reportingUserId, ...reportInfo });
      const report = await transactionManager.save(newReport);
      const reportReason = await this.reportReasonRepository.findOne({ where: { reasonCode: report.reasonCode } });
      const reportEvent = {
        reporting_user_id: reportingUserId,
        reported_user_id: diary.userId,
        diary_id: report.diaryId,
        reason_code: report.reasonCode,
        reason_name: reportReason.reasonName,
        reg_dtm: report.regDtm,
      };
      await this.sendReportEvent(reportEvent);
      return;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async updateDiaryReportAction(actionInfo: ActionInfoDto, transactionManager: EntityManager) {
    try {
      const { reportId, actionCodes } = actionInfo;
      const report = await this.diaryReportRepository.findOne({ where: { reportId } });
      if (!report) {
        throw new NotFoundException('reportId에 해당하는 신고 정보가 없습니다');
      }
      const diary = await this.diaryRepository.findOne({ where: { diaryId: report.diaryId } });
      if (!diary) {
        throw new NotFoundException('다이어리가 존재하지 않습니다');
      }

      const actionDtm = new Date();
      await transactionManager.update(ReportEntity, reportId, {
        actionCodes,
        actionDtm,
        isDone: true,
      });
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
          if (process.env.NODE_ENV === 'local') {
            apiUrl = `http://${process.env.HOST}:3000/api/user/specificuser/${reportingUserId}`;
          } else {
            apiUrl = `http://${process.env.Eureka_HOST}/api/user/specificuser/${reportingUserId}`;
          }
          const reportingUserInfoResponse = await lastValueFrom(this.httpService.get(apiUrl, { headers }));
          const reportingUserInfo = reportingUserInfoResponse.data.data;
          diaryReport['reportingUserName'] = reportingUserInfo.name;
          diaryReport['reportingUserProfile'] = reportingUserInfo.profileUrl;
          diaryReport['reportedUserId'] = Number(diaryReport.diaryIdRelation.userId);
          diaryReport.reportingUserId = Number(diaryReport.reportingUserId);
          delete diaryReport.diaryIdRelation;
          return diaryReport;
        }),
      );

      const finalDiaryReportList = await Promise.all(
        updateDiaryReportList.map(async (updateDiaryReport) => {
          const reportedUserId = updateDiaryReport['reportedUserId'];
          let apiUrl;
          if (process.env.NODE_ENV === 'local') {
            apiUrl = `http://${process.env.HOST}:3000/api/user/specificuser/${reportedUserId}`;
          } else {
            apiUrl = `http://${process.env.Eureka_HOST}/api/user/specificuser/${reportedUserId}`;
          }
          const reportedUserInfoResponse = await lastValueFrom(this.httpService.get(apiUrl, { headers }));
          const reportedUserInfo = reportedUserInfoResponse.data.data;
          const { name: reportedUserName, profileUrl: reportedUserProfileUrl } = reportedUserInfo;
          updateDiaryReport['reportedUserName'] = reportedUserName;
          updateDiaryReport['reportedUserProfileUrl'] = reportedUserProfileUrl;
          return updateDiaryReport;
        }),
      );

      return finalDiaryReportList;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private async sendReportEvent(data: object) {
    const kafkaEnv = process.env.KAFKA_ENV;
    const record: ProducerRecord = {
      topic: `diary-report-${kafkaEnv}`,
      messages: [{ value: JSON.stringify(data) }],
    };
    await this.producerService.produce(record);
  }
}
