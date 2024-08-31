import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryEntity } from '../diary/diary.entity';
import { ReportReasonEntity } from './reportReason.entity';

@Entity('report')
export class ReportEntity {
  @PrimaryGeneratedColumn({ name: 'report_id' })
  reportId: number;

  @Column({ name: 'diary_id', nullable: false })
  diaryId: number;

  @Column({ name: 'reason_code', nullable: true })
  reasonCode: string;

  @Column({ name: 'reporting_user_id', nullable: false })
  reportingUserId: number;

  @Column({ name: 'is_done', default: false, nullable: false })
  isDone: boolean;

  @Column({ name: 'action_codes', type: 'simple-json', default: null, nullable: true })
  actionCodes: string[];

  @CreateDateColumn({ name: 'reg_dtm', nullable: false })
  regDtm: Date;

  @Column({ name: 'acton_dtm', default: null, nullable: true })
  actionDtm: Date;

  @ManyToOne(() => DiaryEntity, (diary) => diary.reportRelation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'diary_id', referencedColumnName: 'diaryId' })
  diaryIdRelation: DiaryEntity;

  @ManyToOne(() => ReportReasonEntity, (reason) => reason.reportRelation, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'reason_code', referencedColumnName: 'reasonCode' })
  reasonCodeRelation: ReportReasonEntity;
}
