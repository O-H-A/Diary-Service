import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from './entities/diary.entity';
import { JwtStrategy } from 'src/auth/strategies/jwt.access.strategy';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity]), HttpModule.register({})],
  controllers: [DiaryController],
  providers: [DiaryService, JwtStrategy, Logger],
})
export class DiaryModule {}
