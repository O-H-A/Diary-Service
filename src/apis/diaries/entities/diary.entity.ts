import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { WeatherType } from '../enums/weather.enum';

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

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'varchar', nullable: false })
  setDate: string;

  @Column({ type: 'varchar', nullable: false })
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
}
