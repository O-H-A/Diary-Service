import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryEntity } from './entities/diary.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateDiaryDto } from './dto/create-diary.dto';

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
}
