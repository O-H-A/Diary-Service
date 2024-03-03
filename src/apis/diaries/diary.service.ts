import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryEntity } from './entities/diary.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Injectable()
export class DiaryService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @InjectRepository(DiaryEntity)
    private readonly diaryRepository: Repository<DiaryEntity>,
  ) {}

  async createDiary(dto: CreateDiaryDto, userId: number, transactionManager: EntityManager) {
    try {
      const newDiary = new DiaryEntity();
      Object.assign(newDiary, { userId, ...dto });
      const diary = await transactionManager.save(newDiary);
      return diary;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async updateDiary(diaryId: number, userId: number, dto: UpdateDiaryDto, transactionManager: EntityManager) {
    try {
      const isSameUser = await this.isSameUser(userId, diaryId);
      if (!isSameUser) {
        throw new ForbiddenException('포스트 수정 권한이 없습니다');
      }
      const result = await transactionManager.update(DiaryEntity, diaryId, { ...dto });
      if (result.affected === 0) {
        throw new BadRequestException('Diary update failed: Nothing updated');
      }
      return;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async deleteDiary(diaryId: number, userId: number, transactionManager: EntityManager) {
    try {
      const isSameUser = await this.isSameUser(userId, diaryId);
      if (!isSameUser) {
        throw new ForbiddenException('포스트 삭제 권한이 없습니다');
      }
      const diary = await this.diaryRepository.findOne({ where: { diaryId } });
      if (!diary) {
        throw new NotFoundException('다이어리가 이미 삭제되었거나 존재하지 않습니다');
      }
      const result = await transactionManager.delete(DiaryEntity, diaryId);
      if (result.affected === 0) {
        throw new BadRequestException('Diary delete failed: Nothing deleted');
      }
      return;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private async isSameUser(currentUserId, diaryId) {
    const diary = await this.diaryRepository.findOne({ where: { diaryId } });
    const diaryWriterId = diary.userId;
    return currentUserId == diaryWriterId;
  }
}
