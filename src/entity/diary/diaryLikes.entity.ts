import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryEntity } from './diary.entity';

@Entity('Diary-Like')
export class DiaryLikeEntity {
  @PrimaryGeneratedColumn({ name: 'likesId' })
  likesId: number;

  @Column({ name: 'diaryId', nullable: false })
  diaryId: number;

  @Column({ name: 'userId', nullable: false })
  userId: number;

  @CreateDateColumn({ name: 'createdAt', nullable: false })
  createdAt: Date;

  @ManyToOne(() => DiaryEntity, (diary) => diary.likeRelation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'diaryId', referencedColumnName: 'diaryId' })
  diaryIdRelation: DiaryEntity;
}
