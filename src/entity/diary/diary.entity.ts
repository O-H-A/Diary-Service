import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { WeatherType } from '../../module/diary/enums/weather.enum';
import { DiaryFileEntity } from './diary-file.entity';
import { DiaryReportEntity } from '../report/diary-report.entity';
import { DiaryLikeEntity } from './diary-likes.entity';

@Entity('Diary')
export class DiaryEntity {
  @PrimaryGeneratedColumn()
  diaryId: number;

  @Column({ type: 'numeric', nullable: false })
  userId: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'enum', enum: WeatherType, nullable: false })
  weather: WeatherType;

  @Column({ type: 'varchar', nullable: true })
  content: string;

  @Column({ type: 'varchar', nullable: false })
  setDate: string;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  isPublic: boolean;

  @Column({ type: 'numeric', default: 0, nullable: false })
  likes: number;

  @Column({ type: 'numeric', default: 0, nullable: false })
  views: number;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @OneToMany(() => DiaryFileEntity, (file) => file.diaryIdRelation)
  fileRelation: DiaryFileEntity[];

  @OneToMany(() => DiaryReportEntity, (report) => report.diaryIdRelation)
  reportRelation: DiaryReportEntity[];

  // @OneToMany(() => DiaryLikeEntity, (like) => like.diaryIdRelation)
  // likeRelation: DiaryLikeEntity[]
}
