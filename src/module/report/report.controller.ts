import { Body, Controller, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReportInfoDto } from './dto/reportInfo.dto';
import {
  ApiBearerAuthAccessToken,
  ApiDescription,
  ApiParamDescription,
  GetUserId,
  TransactionManager,
} from 'src/utils/decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TransactionInterceptor } from 'src/interceptors/transaction.interceptor';
import { DiaryReportService } from './report.service';
import { ApiTags } from '@nestjs/swagger';
import { ActionInfoDto } from './dto/actionInfo.dto';

@ApiTags('REPORT')
@Controller('api/diary/report')
export class DiaryReportController {
  constructor(private readonly reportService: DiaryReportService) {}

  @ApiDescription('다이어리 신고 등록 API')
  @ApiBearerAuthAccessToken()
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createDiaryReport(
    @GetUserId() reportingUserId: number,
    @Body() reportInfo: ReportInfoDto,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.reportService.createDiaryReport(reportingUserId, reportInfo, transactionManager);
    return { message: '신고 등록 성공' };
  }

  @ApiDescription('다이어리 신고조치 업데이트 API')
  @ApiParamDescription('reportId', '숫자로 입력해주세요')
  @ApiBearerAuthAccessToken()
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put('/:reportId')
  async updateDiaryReportAction(
    @Param('reportId') reportId: number,
    @Body() actionInfo: ActionInfoDto,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.reportService.updateDiaryReportAction(reportId, actionInfo, transactionManager);
    return { message: '신고 조치 업데이트 성공' };
  }
}
