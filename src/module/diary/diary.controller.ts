import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUserId, CurrentUserToken, TransactionManager } from '../../common/decorator';
import { DiaryService } from './diary.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { TransactionInterceptor } from '../../common/interceptor/transaction.interceptor';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DiariesInfoDto } from './dto/diaries-info.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DIARIES_OTHER_USERS, DIARY, DIARY_LIKES, DIARY_MY, SPECIFIC_DIARIES } from './swagger/diary.swagger';
import { ResponseDto } from 'src/common/dto/response.dto';

@ApiTags('DIARY')
@Controller('api/diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @ApiOperation(DIARY.POST.API_OPERATION)
  @ApiBody(DIARY.POST.API_BODY)
  @ApiCreatedResponse(DIARY.POST.API_CREATED_RESPONSE)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor, FilesInterceptor('file', 1))
  @Post('/')
  async createDiary(
    @Body() dto: CreateDiaryDto,
    @CurrentUserId() userId: number,
    @TransactionManager() transactionManager,
    @UploadedFiles() file: Express.Multer.File[],
  ): Promise<ResponseDto> {
    await this.diaryService.createDiary(dto, file, userId, transactionManager);

    const result: ResponseDto = { message: '등록 성공' };

    return result;
  }

  @ApiOperation(SPECIFIC_DIARIES.POST.API_OPERATION)
  @ApiBody(SPECIFIC_DIARIES.POST.API_BODY)
  @ApiCreatedResponse(SPECIFIC_DIARIES.POST.API_CREATED_RESPONSE)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('specificdiaries')
  async getSpecificDiaries(
    @Body() dto: DiariesInfoDto,
    @TransactionManager() transactionManager,
  ): Promise<ResponseDto> {
    const diaries = await this.diaryService.getSpecificDiaries(dto, transactionManager);

    const result: ResponseDto = { message: '조회 성공', data: diaries };

    return result;
  }

  @ApiOperation(DIARY_MY.GET.API_OPERATION)
  @ApiOkResponse(DIARY_MY.GET.API_OK_RESPONSE)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async readUserDiary(@CurrentUserId() userId: number, @CurrentUserToken() token: string): Promise<ResponseDto> {
    const diaries = await this.diaryService.readDiary(userId, token);

    const result: ResponseDto = { message: '전체 기간 조회 성공', data: diaries };

    return result;
  }

  @ApiOperation(DIARIES_OTHER_USERS.GET.API_OPERATION)
  @ApiParam(DIARIES_OTHER_USERS.GET.API_PARAM1)
  @ApiOkResponse(DIARIES_OTHER_USERS.GET.API_OK_RESPONSE)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('all-diaries/:userId')
  async readDiary(@Param('userId') userId: number, @CurrentUserToken() token: string): Promise<ResponseDto> {
    const diaries = await this.diaryService.readDiary(userId, token);

    const result: ResponseDto = { message: '전체 기간 조회 성공', data: diaries };

    return result;
  }

  @ApiOperation(DIARY_LIKES.POST.API_OPERATION)
  @ApiParam(DIARY_LIKES.POST.API_PARAM1)
  @ApiCreatedResponse(DIARY_LIKES.POST.API_CREATED_RESPONSE)
  @ApiBadRequestResponse(DIARY_LIKES.POST.API_BAD_REQUEST_RESPONSE)
  @ApiNotFoundResponse(DIARY_LIKES.POST.API_NOT_FOUND_RESPONSE)
  @ApiConflictResponse(DIARY_LIKES.POST.API_CONFLICT_RESPONSE)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('likes/:diaryId')
  async createDiaryLike(
    @Param('diaryId') diaryId: number,
    @CurrentUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<ResponseDto> {
    await this.diaryService.createDiaryLike(diaryId, userId, transactionManager);

    const result: ResponseDto = { message: '좋아요 생성 성공' };

    return result;
  }

  @ApiOperation(DIARY_LIKES.DELETE.API_OPERATION)
  @ApiParam(DIARY_LIKES.DELETE.API_PARAM1)
  @ApiOkResponse(DIARY_LIKES.DELETE.API_OK_RESPONSE)
  @ApiBadRequestResponse(DIARY_LIKES.DELETE.API_BAD_REQUEST_RESPONSE)
  @ApiConflictResponse(DIARY_LIKES.DELETE.API_CONFLICT_RESPONSE)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Delete('likes/:diaryId')
  async deleteDiaryLike(
    @Param('diaryId') diaryId: number,
    @CurrentUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<ResponseDto> {
    await this.diaryService.deleteDiaryLike(diaryId, userId, transactionManager);

    const result: ResponseDto = { message: '좋아요 취소 성공' };

    return result;
  }

  @ApiOperation(DIARY_LIKES.GET.API_OPERATION)
  @ApiParam(DIARY_LIKES.GET.API_PARAM1)
  @ApiOkResponse(DIARY_LIKES.GET.API_OK_RESPONSE)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('likes/:diaryId')
  async getDiaryLike(@Param('diaryId') diaryId: number, @CurrentUserId() userId: number): Promise<ResponseDto> {
    const likesInfo = await this.diaryService.getDiaryLike(diaryId, userId);

    const result: ResponseDto = { message: '좋아요 정보 조회 성공', data: likesInfo };

    return result;
  }

  @ApiOperation(DIARY.PUT.API_OPERATION)
  @ApiConsumes('multipart/form-data')
  @ApiParam(DIARY.PUT.API_PARAM1)
  @ApiOkResponse(DIARY.PUT.API_OK_RESPONSE)
  @ApiBadRequestResponse(DIARY.PUT.API_BAD_REQUEST_RESPONSE)
  @ApiForbiddenResponse(DIARY.PUT.API_FORBIDDEN_RESPONSE)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor, FilesInterceptor('file', 1))
  @Put(':diaryId')
  async updateDiary(
    @Param('diaryId') diaryId: number,
    @Body() dto: UpdateDiaryDto,
    @CurrentUserId() userId: number,
    @TransactionManager() transactionManager,
    @UploadedFiles() file: Express.Multer.File[],
  ): Promise<ResponseDto> {
    if (file !== undefined) {
      await this.diaryService.updateDiary(diaryId, file, userId, dto, transactionManager);
    } else {
      await this.diaryService.updateDiary(diaryId, undefined, userId, dto, transactionManager);
    }

    const result: ResponseDto = { message: '수정 성공' };

    return result;
  }

  @ApiOperation(DIARY.DELETE.API_OPERATION)
  @ApiParam(DIARY.DELETE.API_PARAM1)
  @ApiOkResponse(DIARY.DELETE.API_OK_RESPONSE)
  @ApiBadRequestResponse(DIARY.DELETE.API_BAD_REQUEST_RESPONSE)
  @ApiForbiddenResponse(DIARY.DELETE.API_FORBIDDEN_RESPONSE)
  @ApiNotFoundResponse(DIARY.DELETE.API_NOT_FOUND_RESPONSE)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Delete(':diaryId')
  async deleteDiary(
    @Param('diaryId') diaryId: number,
    @CurrentUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<ResponseDto> {
    await this.diaryService.deleteDiary(diaryId, userId, transactionManager);

    const result: ResponseDto = { message: '삭제 성공' };

    return result;
  }

  @ApiOperation(DIARY.GET.API_OPERATION)
  @ApiParam(DIARY.GET.API_PARAM1)
  @ApiOkResponse(DIARY.GET.API_OK_RESPONSE)
  @ApiNotFoundResponse(DIARY.GET.API_NOT_FOUND_RESPONSE)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Get(':diaryId')
  async readDiaryDetail(
    @Param('diaryId') diaryId: number,
    @CurrentUserToken() token: string,
    @TransactionManager() transactionManager,
  ): Promise<ResponseDto> {
    const diary = await this.diaryService.readDiaryDetail(diaryId, token, transactionManager);

    const result: ResponseDto = { message: '상세 조회 성공', data: diary };

    return result;
  }
}
