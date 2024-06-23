import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryEntity } from '../diary/diary.entity';
import { ReportReasonEntity } from './reportReason.entity';

@Entity('Diary-Report')
export class DiaryReportEntity {
  @PrimaryGeneratedColumn()
  reportId: number;

  @Column({ type: 'numeric', name: 'diaryId', nullable: false })
  diaryId: number;

  @Column({ type: 'numeric', nullable: false })
  reasonCode: string;

  @Column({ type: 'numeric', nullable: false })
  reportingUserId: number;

  @Column({ type: 'boolean', default: false, nullable: false })
  isDone: boolean;

  @Column({ type: 'varchar', default: null, nullable: true })
  actionCodes: string[];

  @CreateDateColumn({ nullable: false })
  regDtm: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  actionDtm: Date;

  @ManyToOne(() => DiaryEntity, (diary) => diary.reportRelation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'diaryId', referencedColumnName: 'diaryId' })
  diaryIdRelation: DiaryEntity;

  @ManyToOne(() => ReportReasonEntity, (reason) => reason.reportRelation, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'reasonCode', referencedColumnName: 'code' })
  reasonCodeRelation: ReportReasonEntity;
}
