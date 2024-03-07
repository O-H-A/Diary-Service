import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DiaryEntity } from './diary.entity';

@Entity('Diary-File')
export class DiaryFileEntity {
  @PrimaryGeneratedColumn()
  fileId: number;

  @Column({ type: 'varchar', nullable: false })
  fileUrl: string;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @ManyToOne(() => DiaryEntity, (diary) => diary.fileRelation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  // @JoinColumn([{ name: 'diary_id', referencedColumnName: 'diaryId' }])
  diaryRelation: DiaryEntity;
}
