import { Body, Controller, Get, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReportInfoDto } from './dto/reportInfo.dto';
import { GetUserId, GetUserToken, TransactionManager } from 'src/utils/decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TransactionInterceptor } from 'src/interceptors/transaction.interceptor';
import { DiaryReportService } from './report.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActionInfoDto } from './dto/actionInfo.dto';
import { ReportReasonEnum } from './enum/enum';
import { DIARY_ADMIN_REPORTLIST, DIARY_ADMIN_REPORT_ACTION, DIARY_REPORT } from 'src/common/swagger/report.swagger';
import { UserRolesGuard } from 'src/auth/guards/userRole.guard';
import { UserRole } from 'src/common/decorator/userRole.decorator';
import { UserGradeEnum } from 'src/common/enum/enum';

@Controller('api/diary')
export class DiaryReportController {
  constructor(private readonly reportService: DiaryReportService) {}

  @ApiTags('DIARY')
  @ApiOperation(DIARY_REPORT.POST.API_OPERATION)
  @ApiResponse(DIARY_REPORT.POST.API_RESPONSE_OK)
  @ApiResponse(DIARY_REPORT.POST.API_RESPONSE_ERR_400)
  @ApiResponse(DIARY_REPORT.POST.API_RESPONSE_ERR_404)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard, UserRolesGuard)
  @UserRole(UserGradeEnum.USER)
  @Post('/report')
  async createDiaryReport(
    @GetUserId() reportingUserId: number,
    @Body() reportInfo: ReportInfoDto,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.reportService.createDiaryReport(reportingUserId, reportInfo, transactionManager);
    return { message: '신고 등록 성공' };
  }

  @ApiTags('DIARY (관리자)')
  @ApiOperation(DIARY_ADMIN_REPORT_ACTION.PATCH.API_OPERATION)
  @ApiBody(DIARY_ADMIN_REPORT_ACTION.PATCH.API_BODY)
  @ApiResponse(DIARY_ADMIN_REPORT_ACTION.PATCH.API_RESPONSE_OK)
  @ApiResponse(DIARY_ADMIN_REPORT_ACTION.PATCH.API_RESPONSE_ERR_400)
  @ApiResponse(DIARY_ADMIN_REPORT_ACTION.PATCH.API_RESPONSE_ERR_404)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard, UserRolesGuard)
  @UserRole(UserGradeEnum.ADMIN)
  @Patch('/admin/report/action')
  async updateDiaryReportAction(
    @Body() actionInfo: ActionInfoDto,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    console.log(actionInfo);
    await this.reportService.updateDiaryReportAction(actionInfo, transactionManager);
    return { message: '신고 조치 업데이트 성공' };
  }

  @ApiTags('DIARY (관리자)')
  @ApiOperation(DIARY_ADMIN_REPORTLIST.GET.API_OPERATION)
  @ApiQuery(DIARY_ADMIN_REPORTLIST.GET.API_QUERY_1)
  @ApiQuery(DIARY_ADMIN_REPORTLIST.GET.API_QUERY_2)
  @ApiResponse(DIARY_ADMIN_REPORTLIST.GET.API_RESPONSE_OK)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard, UserRolesGuard)
  @UserRole(UserGradeEnum.ADMIN)
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
