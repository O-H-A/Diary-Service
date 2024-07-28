import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryEntity } from './diary.entity';

@Entity('Diary-Like')
export class DiaryLikeEntity {
  @PrimaryGeneratedColumn()
  likesId: number;

  @Column({ type: 'numeric', nullable: false })
  diaryId: number;

  @Column({ type: 'numeric', nullable: false })
  userId: number;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  // @ManyToOne(() => DiaryEntity, (diary) => diary.likeRelation, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn({ name: 'diaryId', referencedColumnName: 'diaryId' })
  // diaryIdRelation: DiaryEntity;
}
