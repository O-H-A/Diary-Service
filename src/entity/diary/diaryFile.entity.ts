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
  @PrimaryGeneratedColumn({ name: 'fileId' })
  fileId: number;

  @Column({ name: 'diaryId', nullable: false })
  diaryId: number;

  @Column({ name: 'fileUrl', nullable: false })
  fileUrl: string;

  @CreateDateColumn({ name: 'createdAt', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: false })
  updatedAt: Date;

  @ManyToOne(() => DiaryEntity, (diary) => diary.fileRelation, {
    // 부모 엔티티가 업데이트되면 자식 엔티티까지 영향이 간다.
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'diaryId', referencedColumnName: 'diaryId' })
  diaryIdRelation: DiaryEntity;
}
