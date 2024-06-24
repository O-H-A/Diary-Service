import { Body, Controller, Get, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReportInfoDto } from './dto/reportInfo.dto';
import {
  ApiBearerAuthAccessToken,
  ApiDescription,
  GetUserId,
  GetUserToken,
  TransactionManager,
} from 'src/utils/decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TransactionInterceptor } from 'src/interceptors/transaction.interceptor';
import { DiaryReportService } from './report.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ActionInfoDto } from './dto/actionInfo.dto';
import { ReportReasonEnum } from './enum/enum';

@Controller('api/diary')
export class DiaryReportController {
  constructor(private readonly reportService: DiaryReportService) {}

  @ApiTags('DIARY')
  @ApiDescription('다이어리 신고 등록 API')
  @ApiBearerAuthAccessToken()
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/report')
  async createDiaryReport(
    @GetUserId() reportingUserId: number,
    @Body() reportInfo: ReportInfoDto,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.reportService.createDiaryReport(reportingUserId, reportInfo, transactionManager);
    return { message: '신고 등록 성공' };
  }

  @ApiTags('DIARY (관리자')
  @ApiDescription('다이어리 신고조치 업데이트 API')
  @ApiBearerAuthAccessToken()
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put('/admin/report/action')
  async updateDiaryReportAction(
    @Body() actionInfo: ActionInfoDto,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.reportService.updateDiaryReportAction(actionInfo, transactionManager);
    return { message: '신고 조치 업데이트 성공' };
  }

  @ApiTags('DIARY (관리자')
  @ApiDescription('다이어리 신고 정보 조회 API')
  @ApiQuery({
    name: 'reasonCode',
    description: '신고 사유 코드를 입력해주세요',
    required: false,
  })
  @ApiQuery({ name: 'isDone', description: '신고 조치 여부를 입력해주세요', required: false })
  @ApiBearerAuthAccessToken()
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/admin/report/reportList')
  async getDiaryReportList(
    @GetUserToken() token: string,
    @Query('reasonCode') reasonCode: ReportReasonEnum,
    @Query('isDone') isDone: boolean,
  ): Promise<{ message: string; result: any }> {
    const result = await this.reportService.getDiaryReportList(token, reasonCode, isDone);
    return { message: '모든 다이어리 신고 목록 조회 성공', result };
  }
}
