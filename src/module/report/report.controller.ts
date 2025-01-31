import { Body, Controller, Get, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReportInfoDto } from './dto/reportInfo.dto';
import { CurrentUserId, CurrentUserToken, TransactionManager } from '../../common/decorator';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { TransactionInterceptor } from '../../common/interceptor/transaction.interceptor';
import { DiaryReportService } from './report.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActionInfoDto } from './dto/actionInfo.dto';
import { ReportReasonEnum } from './enum/enum';
import { DIARY_ADMIN_REPORTLIST, DIARY_ADMIN_REPORT_ACTION, DIARY_REPORT } from './swagger/report.swagger';
import { UserRolesGuard } from '../../auth/guard/userRole.guard';
import { UserRole } from '../../common/decorator/role.decorator';
import { UserGradeEnum } from '../../common/enum/enum';
import { ResponseDto } from 'src/common/dto/response.dto';

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
    @CurrentUserId() reportingUserId: number,
    @Body() reportInfo: ReportInfoDto,
    @TransactionManager() transactionManager,
  ): Promise<ResponseDto> {
    await this.reportService.createDiaryReport(reportingUserId, reportInfo, transactionManager);

    const result: ResponseDto = { message: '신고 등록 성공' };

    return result;
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
  ): Promise<ResponseDto> {
    await this.reportService.updateDiaryReportAction(actionInfo, transactionManager);

    const result: ResponseDto = { message: '신고 조치 업데이트 성공' };

    return result;
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
    @CurrentUserToken() token: string,
    @Query('reasonCode') reasonCode: ReportReasonEnum,
    @Query('isDone') isDone: boolean,
  ): Promise<ResponseDto> {
    const reports = await this.reportService.getDiaryReportList(token, reasonCode, isDone);

    const result: ResponseDto = { message: '모든 다이어리 신고 목록 조회 성공', data: reports };

    return result;
  }
}
