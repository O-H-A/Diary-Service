import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryEntity } from '../../entity/diary/diary.entity';
import { EntityManager, Repository, In } from 'typeorm';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { DiaryLikeEntity } from '../../entity/diary/diary-likes.entity';
import { ConfigService } from '@nestjs/config';
import { DiaryFileEntity } from 'src/entity/diary/diary-file.entity';
import { unlink } from 'fs/promises';
import { UPLOAD_PATH } from 'src/utils/path';
import { ProducerService } from 'src/module/kafka/kafka.producer.service';
import { ConsumerService } from '../kafka/kafka.consumer.service';
import { ProducerRecord } from 'kafkajs';

@Injectable()
export class DiaryService implements OnModuleInit {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @InjectRepository(DiaryEntity)
    private readonly diaryRepository: Repository<DiaryEntity>,
    @InjectRepository(DiaryLikeEntity)
    private readonly diaryLikeRepository: Repository<DiaryLikeEntity>,
    private readonly httpService: HttpService,
    private configService: ConfigService,
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  async createDiary(dto: CreateDiaryDto, filename: string, userId: number, transactionManager: EntityManager) {
    try {
      if (!filename) {
        throw new BadRequestException('다이어리 사진은 필수입니다.');
      }
      const newDiary = new DiaryEntity();
      Object.assign(newDiary, { userId, ...dto });
      const diary = await transactionManager.save(newDiary);
      const fileUrl = `https://ohauser2.serveftp.com/files/diary/${filename}`;
      const newFile = new DiaryFileEntity();
      Object.assign(newFile, { diaryId: diary.diaryId, fileUrl });
      await transactionManager.save(newFile);
      return;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async updateDiary(
    diaryId: number,
    filename: string | undefined,
    userId: number,
    dto: UpdateDiaryDto,
    transactionManager: EntityManager,
  ) {
    try {
      const isSameUser = await this.isSameUser(userId, diaryId);
      if (!isSameUser) {
        throw new ForbiddenException('다이어리 수정 권한이 없습니다');
      }

      // 다이어리 사진 변경
      if (filename !== undefined) {
        const fileUrl = `http://${this.configService.get('Eureka_HOST')}/files/diary/${filename}`;
        const diaryFile = await transactionManager.findOne(DiaryEntity, {
          where: { diaryId },
          relations: { fileRelation: true },
        });
        const fileId = diaryFile.fileRelation[0].fileId;
        const previousFileUrl = diaryFile.fileRelation[0].fileUrl;
        await transactionManager.update(DiaryFileEntity, fileId, { fileUrl });

        // 스토리지에 저장되어있는 이미지 삭제
        const diaryFileName = previousFileUrl.split('/').pop();
        await unlink(`${UPLOAD_PATH}/${diaryFileName}`);
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
        throw new ForbiddenException('다이어리 삭제 권한이 없습니다');
      }

      const diary = await transactionManager.findOne(DiaryEntity, {
        where: { diaryId },
        relations: { fileRelation: true },
      });
      if (!diary) {
        throw new NotFoundException('다이어리가 이미 삭제되었거나 존재하지 않습니다');
      }

      // 다이어리 좋아요 정보 삭제 (만약 있다면)
      await transactionManager.query(`DELETE FROM public."Diary-Like" WHERE "diaryId" = ${diaryId}`);

      // 다이어리 삭제
      const result = await transactionManager.delete(DiaryEntity, { diaryId });
      if (result.affected === 0) {
        throw new BadRequestException('Diary delete failed: Nothing deleted');
      }

      // 스토리지에 저장되어있는 이미지도 함께 삭제
      const diaryFileUrl = diary.fileRelation[0].fileUrl;
      const diaryFileName = diaryFileUrl.split('/').pop();
      await unlink(`${UPLOAD_PATH}/${diaryFileName}`);

      return;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async readDiary(userId: number, token: string) {
    try {
      // 사용자 정보 불러오기
      const accessToken = token;
      const headers = { Authorization: `Bearer ${accessToken}` };
      let apiUrl;
      if (process.env.NODE_ENV === 'dev') {
        apiUrl = `http://${process.env.HOST}:3000/api/user/specificuser/${userId}`;
      } else {
        apiUrl = `http://${process.env.Eureka_HOST}/api/user/specificuser/${userId}`;
      }

      const writerInfo = await lastValueFrom(this.httpService.get(apiUrl, { headers })); // 사용자 정보

      // 사용자 일기 전체 불러오기
      const diaries = await this.diaryRepository.find({
        where: { userId },
        relations: { fileRelation: true },
        order: {
          setDate: 'DESC',
        },
      });
      return { writer: writerInfo.data.data, diaries };
    } catch (e) {
      this.logger.error(e);
      if (e.response && e.response.data) {
        if (e.response.data.statusCode === HttpStatus.NOT_FOUND) {
          throw new NotFoundException(`${e.response.data.message}`);
        }
      }
      throw e;
    }
  }

  async readDiaryDetail(diaryId: number, token: string, transactionManager: EntityManager) {
    try {
      // 조회수 1증가
      await transactionManager.query(`UPDATE public."Diary" SET "views" = "views" + 1 WHERE "diaryId" = ${diaryId} `);

      const viewUpdatedDiary = await transactionManager.findOne(DiaryEntity, {
        where: { diaryId },
        relations: { fileRelation: true },
      });

      if (!viewUpdatedDiary) {
        throw new NotFoundException('존재하지 않는 다이어리 입니다.');
      }

      // 다이어리 작성자 정보 불러오기
      const { userId, ...restData } = viewUpdatedDiary;
      const accessToken = token;
      const headers = { Authorization: `Bearer ${accessToken}` };
      let apiUrl;
      if (process.env.NODE_ENV === 'dev') {
        apiUrl = `http://${process.env.HOST}:3000/api/user/specificuser/${userId}`;
      } else {
        apiUrl = `http://${process.env.Eureka_HOST}/api/user/specificuser/${userId}`;
      }

      const diaryWriterInfo = await lastValueFrom(this.httpService.get(apiUrl, { headers }));

      return { ...restData, writer: diaryWriterInfo.data.data };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async createDiaryLike(diaryId: number, userId: number, transactionManager: EntityManager) {
    try {
      if (!diaryId || !userId) {
        throw new BadRequestException('요청 값이 올바르지 않습니다');
      }

      // 좋아요를 이미 눌렀을 경우 에러처리
      const likeInfo = await this.diaryLikeRepository.findOne({ where: { diaryId, userId } });
      if (likeInfo) {
        throw new ConflictException('좋아요를 이미 눌렀습니다');
      }

      // 좋아요 클릭 정보 저장
      const newDiaryLike = new DiaryLikeEntity();
      Object.assign(newDiaryLike, { diaryId, userId });
      await transactionManager.save(newDiaryLike);

      // 좋아요 클릭 수 업데이트 (1증가)
      await transactionManager.query(`UPDATE public."Diary" SET "likes" = "likes" + 1 WHERE "diaryId" = ${diaryId}`);

      // 다이어리 정보가 없을 경우 에러 처리
      const diary = await this.diaryRepository.findOne({ where: { diaryId } });
      if (!diary) {
        throw new NotFoundException('다이어리가 삭제되었거나 존재하지 않습니다');
      }

      // 좋아요 이벤트 정보 카프카로 보내기
      const diaryLikeEvent = {
        userId: diary.userId,
        diaryId: diary.diaryId,
        likeUserId: userId,
        diaryImageUrl: (diary.fileRelation && diary.fileRelation[0].fileUrl) || null,
      };
      console.log(diaryLikeEvent);
      await this.sendDiaryLikeEvent(diaryLikeEvent);

      return;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async deleteDiaryLike(diaryId: number, userId: number, transactionManager: EntityManager) {
    try {
      if (!diaryId || !userId) {
        throw new BadRequestException('요청 값이 올바르지 않습니다');
      }

      const result = await transactionManager.delete(DiaryLikeEntity, { diaryId, userId });

      if (result.affected === 0) {
        throw new ConflictException('좋아요를 이미 취소했거나 다이어리가 존재하지 않습니다');
      }
      await transactionManager.query(`UPDATE public."Diary" SET "likes" = "likes" - 1 WHERE "diaryId" = ${diaryId}`);

      return;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getDiaryLike(diaryId: number, userId: number) {
    try {
      const allDiaryLikes = await this.diaryLikeRepository.find({ where: { diaryId } });
      return { DiaryLikesInfo: allDiaryLikes, currentUserId: userId.toString() };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getSpecificDiaries(dto, manager: EntityManager) {
    try {
      const { diaryIds } = dto;
      if (!diaryIds || diaryIds.length === 0) {
        throw new BadRequestException('요청한 다이어리 아이디가 없습니다.');
      }
      const diaries = await manager.getRepository(DiaryEntity).find({
        where: { diaryId: In(diaryIds) },
      });
      return diaries;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async deleteDiariesByUserId(userId: number) {
    await this.diaryRepository.delete({ userId });
    // 다이어리 좋아요 삭제
    await this.diaryLikeRepository.delete({ userId });
    return;
  }

  async sendDiaryLikeEvent(data: object) {
    const kafkaEnv = process.env.KAFKA_ENV;
    const record: ProducerRecord = {
      topic: `diary-like-${kafkaEnv}`,
      messages: [{ value: JSON.stringify(data) }],
    };
    await this.producerService.produce(record);
  }

  async onModuleInit() {
    const kafkaEnv = process.env.KAFKA_ENV;
    await this.consumerService.consume(
      {
        topics: [`user-withdraw-${kafkaEnv}`],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const event = JSON.parse(message.value.toString());
          const { userId } = event;
          // Diary 테이블에서 userId 관련 정보 모두 삭제
          await this.deleteDiariesByUserId(userId);
        },
      },
    );
  }

  private async isSameUser(currentUserId: number, diaryId: number) {
    const diary = await this.diaryRepository.findOne({ where: { diaryId } });
    const diaryWriterId = diary.userId;
    return currentUserId == diaryWriterId;
  }
}
