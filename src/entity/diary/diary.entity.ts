import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { WeatherType } from '../../module/diary/enum/weather.enum';
import { DiaryFileEntity } from './diaryFile.entity';
import { ReportEntity } from '../report/report.entity';
import { DiaryLikeEntity } from './diaryLikes.entity';

@Entity('diary')
export class DiaryEntity {
  @PrimaryGeneratedColumn({ name: 'diary_id' })
  diaryId: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'weather', type: 'enum', enum: WeatherType, nullable: false })
  weather: WeatherType;

  @Column({ name: 'content', nullable: true })
  content: string;

  @Column({ name: 'set_date', nullable: false })
  setDate: string;

  @Column({ name: 'location', nullable: true })
  location: string;

  @Column({ name: 'is_public', type: 'boolean', nullable: true })
  isPublic: boolean;

  @Column({ name: 'likes', type: 'smallint', default: 0, nullable: false })
  likes: number;

  @Column({ name: 'views', type: 'smallint', default: 0, nullable: false })
  views: number;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @OneToMany(() => DiaryFileEntity, (file) => file.diaryIdRelation)
  fileRelation: DiaryFileEntity[];

  @OneToMany(() => ReportEntity, (report) => report.diaryIdRelation)
  reportRelation: ReportEntity[];

  @OneToMany(() => DiaryLikeEntity, (like) => like.diaryIdRelation)
  likeRelation: DiaryLikeEntity[];
}
