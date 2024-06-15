import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from '../../entity/diary/diary.entity';
import { JwtStrategy } from '../../auth/strategies/jwt.access.strategy';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { HttpModule } from '@nestjs/axios';
import { DiaryLikeEntity } from '../../entity/diary/diary-likes.entity';
import { DiaryFileEntity } from '../../entity/diary/diary-file.entity';
import { DiskStorageModule } from '../../config/multer.module';
import { ProducerService } from '../kafka/kafka.producer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntity, DiaryLikeEntity, DiaryFileEntity]),
    HttpModule.register({}),
    DiskStorageModule,
  ],
  controllers: [DiaryController],
  providers: [DiaryService, JwtStrategy, Logger, ProducerService],
})
export class DiaryModule {}
