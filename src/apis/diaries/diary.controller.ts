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

  @ApiDescription('다이어리 등록 API')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor, FileInterceptor('file'))
  @Post('create')
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
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put('update/:diaryId')
  async updateDiary(
    @Param('diaryId') diaryId: number,
    @Body() dto: UpdateDiaryDto,
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.diaryService.updateDiary(diaryId, userId, dto, transactionManager);
    return { message: '수정 성공' };
  }

  @ApiDescription('다이어리 삭제 API')
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Delete('delete/:diaryId')
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
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @Get('read/:diaryId')
  async readDiaryDetail(
    @Param('diaryId') diaryId: number,
    @GetUserToken() token: string,
  ): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.readDiaryDetail(diaryId, token);
    return { message: '상세 조회 성공', result };
  }

  @ApiDescription('다이어리 좋아요 생성 API')
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('uplike/:diaryId')
  async createDiaryLike(
    @Param('diaryId') diaryId: number,
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.diaryService.createDiaryLike(diaryId, userId, transactionManager);
    return { message: '좋아요 생성 성공' };
  }

  @ApiDescription('다이어리 좋아요 취소 API')
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('downlike/:diaryId')
  async deleteDiaryLike(
    @Param('diaryId') diaryId: number,
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.diaryService.deleteDiaryLike(diaryId, userId, transactionManager);
    return { message: '좋아요 취소 성공' };
  }

  @ApiDescription('사용자가 작성한 다이어리 전체 조회 API')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async readUserDiaries(
    @GetUserId() userId: number,
    @GetUserToken() token: string,
  ): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.readUserDiary(userId, token);
    return { message: '조회 성공', result };
  }

  @ApiDescription('사용자가 작성한 다이어리 조회 (달력표시) API')
  @Get('readlike/:userId')
  async readUserDiary() {}

  @ApiDescription('다이어리 신고하기 API')
  @Post('report')
  async reportDiary() {}
}
