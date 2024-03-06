import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from './entities/diary.entity';
import { JwtStrategy } from 'src/auth/strategies/jwt.access.strategy';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { HttpModule } from '@nestjs/axios';
import { DiaryLikeEntity } from './entities/diary-likes.entity';
import { DiaryFileEntity } from './entities/diary-file.entity';
import { DiskStorageModule } from 'src/configs/multer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntity, DiaryLikeEntity, DiaryFileEntity]),
    HttpModule.register({}),
    DiskStorageModule,
  ],
  controllers: [DiaryController],
  providers: [DiaryService, JwtStrategy, Logger],
})
export class DiaryModule {}
