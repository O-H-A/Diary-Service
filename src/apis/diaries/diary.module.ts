import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from './entities/diary.entity';
import { JwtStrategy } from 'src/auth/strategies/jwt.access.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity])],
  controllers: [],
  providers: [JwtStrategy],
})
export class DiaryModule {}
