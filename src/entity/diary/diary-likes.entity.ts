import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
