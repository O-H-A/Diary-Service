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

@Entity('diary_file')
export class DiaryFileEntity {
  @PrimaryGeneratedColumn({ name: 'file_id' })
  fileId: number;

  @Column({ name: 'diary_id', nullable: false })
  diaryId: number;

  @Column({ name: 'file_url', nullable: false })
  fileUrl: string;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @ManyToOne(() => DiaryEntity, (diary) => diary.fileRelation, {
    // 부모 엔티티가 업데이트되면 자식 엔티티까지 영향이 간다.
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'diary_id', referencedColumnName: 'diaryId' })
  diaryIdRelation: DiaryEntity;
}
