import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuthAccessToken,
  ApiDescription,
  ApiParamDescription,
  ApiReponseDeleteDiaryLike,
  ApiResponseCreateDiary,
  ApiResponseCreateDiaryLike,
  ApiResponseDeleteDiary,
  ApiResponseDiary,
  ApiResponseDiaryDetail,
  ApiResponseErrorBadRequest,
  ApiResponseErrorConflict,
  ApiResponseErrorForbidden,
  ApiResponseErrorNotFound,
  ApiResponseGetDiaryLike,
  ApiResponseUpdateDiary,
  ApiTagDiary,
  GetUserId,
  GetUserToken,
  TransactionManager,
} from 'src/utils/decorators';
import { DiaryService } from './diary.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { TransactionInterceptor } from 'src/interceptors/transaction.interceptor';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTagDiary()
@Controller('api/diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @ApiDescription('사용자가 작성한 다이어리 조회 API - 전체 기간', '가장 최근에 등록된 순으로 정렬됩니다')
  @ApiResponseDiary()
  @ApiResponseErrorNotFound('존재하지 않는 사용자')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async readUserDiary(
    @GetUserId() userId: number,
    @GetUserToken() token: string,
  ): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.readDiary(userId, token);
    return { message: '전체 기간 조회 성공', result };
  }

  @ApiDescription('다른 사용자가 작성한 다이어리 조회 API - 전체 기간', '가장 최근에 등록된 순으로 정렬됩니다')
  @ApiParamDescription('userId', '숫자로 입력해주세요')
  @ApiResponseDiary()
  @ApiResponseErrorNotFound('존재하지 않는 사용자')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @Get('all-diaries/:userId')
  async readDiary(
    @Param('userId') userId: number,
    @GetUserToken() token: string,
  ): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.readDiary(userId, token);
    return { message: '전체 기간 조회 성공', result };
  }

  @ApiDescription('다이어리 좋아요 생성 API', '좋아요 클릭 시 사용되는 api')
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiResponseCreateDiaryLike()
  @ApiResponseErrorBadRequest('diaryId 혹은 userId가 요청되지 않았을 경우')
  @ApiResponseErrorConflict('좋아요를 이미 눌렀을 경우')
  @ApiResponseErrorNotFound('다이어리가 이미 삭제되었거나 존재하지 않을 경우')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('likes/:diaryId')
  async createDiaryLike(
    @Param('diaryId') diaryId: number,
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.diaryService.createDiaryLike(diaryId, userId, transactionManager);
    return { message: '좋아요 생성 성공' };
  }

  @ApiDescription('다이어리 좋아요 취소 API', '좋아요 취소 시 사용되는 api')
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiReponseDeleteDiaryLike()
  @ApiResponseErrorBadRequest('diaryId 혹은 userId가 요청되지 않았을 경우')
  @ApiResponseErrorConflict('좋아요가 이미 취소되었거나 다이어리가 존재하지 않을 경우')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Delete('likes/:diaryId')
  async deleteDiaryLike(
    @Param('diaryId') diaryId: number,
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.diaryService.deleteDiaryLike(diaryId, userId, transactionManager);
    return { message: '좋아요 취소 성공' };
  }

  @ApiDescription(
    '다이어리 좋아요 정보 조회 API',
    '다이어리 상세 조회 시 사용자가 해당 다이어리에 이미 좋아요를 눌렀는지 확인하는 용도입니다. 해당 다이어리에 좋아요를 누른 모든 사용자 아이디가 응답값으로 반환됩니다. 좋아요가 아직 없는 다이어리일 경우 빈 배열이 응답값으로 반환됩니다',
  )
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiResponseGetDiaryLike()
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @Get('likes/:diaryId')
  async getDiaryLike(
    @Param('diaryId') diaryId: number,
    @GetUserId() userId: number,
  ): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.getDiaryLike(diaryId, userId);
    return { message: '좋아요 정보 조회 성공', result };
  }

  @ApiDescription('다이어리 등록 API')
  @ApiBearerAuthAccessToken()
  @ApiResponseCreateDiary()
  @ApiResponseErrorBadRequest('다이어리 사진은 필수')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor, FileInterceptor('file'))
  @Post('/')
  async createDiary(
    @Body() dto: CreateDiaryDto,
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.createDiary(dto, file.filename, userId, transactionManager);
    return { message: '등록 성공', result };
  }

  @ApiDescription('다이어리 수정 API')
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiResponseUpdateDiary()
  @ApiResponseErrorForbidden('다이어리 수정 권한이 없음')
  @ApiResponseErrorBadRequest('수정된 다이어리 없음')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor, FileInterceptor('file'))
  @Put(':diaryId')
  async updateDiary(
    @Param('diaryId') diaryId: number,
    @Body() dto: UpdateDiaryDto,
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string }> {
    if (file !== undefined) {
      await this.diaryService.updateDiary(diaryId, file.filename, userId, dto, transactionManager);
    } else {
      await this.diaryService.updateDiary(diaryId, undefined, userId, dto, transactionManager);
    }
    return { message: '수정 성공' };
  }

  @ApiDescription('다이어리 삭제 API')
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiResponseDeleteDiary()
  @ApiResponseErrorForbidden('다이어리 삭제 권한이 없음')
  @ApiResponseErrorNotFound('다이어리가 이미 삭제되었거나 존재하지 않음')
  @ApiResponseErrorBadRequest('삭제된 다이어리 없음')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Delete(':diaryId')
  async deleteDiary(
    @Param('diaryId') diaryId: number,
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.diaryService.deleteDiary(diaryId, userId, transactionManager);
    return { message: '삭제 성공' };
  }

  @ApiDescription('다이어리 상세 조회 API')
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiResponseDiaryDetail()
  @ApiResponseErrorNotFound('존재하지 않는 다이어리')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Get(':diaryId')
  async readDiaryDetail(
    @Param('diaryId') diaryId: number,
    @GetUserToken() token: string,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.readDiaryDetail(diaryId, token, transactionManager);
    return { message: '상세 조회 성공', result };
  }
}
