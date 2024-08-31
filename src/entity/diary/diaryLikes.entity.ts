import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryEntity } from './diary.entity';

@Entity('diary_like')
export class DiaryLikeEntity {
  @PrimaryGeneratedColumn({ name: 'likes_id' })
  likesId: number;

  @Column({ name: 'diary_id', nullable: false })
  diaryId: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @ManyToOne(() => DiaryEntity, (diary) => diary.likeRelation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'diary_id', referencedColumnName: 'diaryId' })
  diaryIdRelation: DiaryEntity;
}
