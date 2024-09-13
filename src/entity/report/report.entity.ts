import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryEntity } from '../diary/diary.entity';
import { ReportReasonEntity } from './reportReason.entity';

@Entity('Diary-Report')
export class ReportEntity {
  @PrimaryGeneratedColumn({ name: 'reportId' })
  reportId: number;

  @Column({ name: 'diaryId', nullable: false })
  diaryId: number;

  @Column({ name: 'reasonCode', nullable: true })
  reasonCode: string;

  @Column({ name: 'reportingUserId', nullable: false })
  reportingUserId: number;

  @Column({ name: 'isDone', default: false, nullable: false })
  isDone: boolean;

  @Column({ name: 'actionCodes', type: 'simple-json', default: null, nullable: true })
  actionCodes: string[];

  @CreateDateColumn({ name: 'regDtm', nullable: false })
  regDtm: Date;

  @Column({ name: 'actonDtm', default: null, nullable: true })
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
  @JoinColumn({ name: 'reasonCode', referencedColumnName: 'reasonCode' })
  reasonCodeRelation: ReportReasonEntity;
}
