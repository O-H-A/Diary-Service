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
    // 부모 엔티티가 업데이트되면 자식 엔티티까지 영향이 간다.
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  diaryRelation: DiaryEntity;
}
