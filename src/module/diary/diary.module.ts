import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from '../../entity/diary/diary.entity';
import { JwtStrategy } from '../../auth/strategy/jwt.access.strategy';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { HttpModule } from '@nestjs/axios';
import { DiaryLikeEntity } from '../../entity/diary/diaryLikes.entity';
import { DiaryFileEntity } from '../../entity/diary/diaryFile.entity';
import { DiskStorageModule } from '../../config/multer.module';
import { ProducerService } from '../kafka/kafka.producer.service';
import { ConsumerService } from '../kafka/kafka.consumer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntity, DiaryLikeEntity, DiaryFileEntity]),
    HttpModule.register({}),
    DiskStorageModule,
  ],
  controllers: [DiaryController],
  providers: [DiaryService, JwtStrategy, Logger, ProducerService, ConsumerService],
  exports: [ConsumerService, ProducerService],
})
export class DiaryModule {}
