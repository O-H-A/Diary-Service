import { ReportType } from 'src/module/diary/report/enum/enum';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryEntity } from '../diary/diary.entity';

@Entity('Diary-Report')
export class DiaryReportEntity {
  @PrimaryGeneratedColumn()
  reportId: number;

  @Column({ name: 'diaryId', nullable: false })
  diaryId: number;

  @Column({ type: 'enum', enum: ReportType, nullable: false })
  reportType: ReportType;

  @Column({ type: 'numeric', nullable: false })
  reporterId: number;

  @Column({ type: 'varchar', nullable: false }) // enum으로 할지 보류
  reportStatus: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  resolvedNote: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  reportTime: Date;

  @Column({ type: 'timestamptz', default: null, nullable: true })
  resolvedTime: Date;

  @ManyToOne(() => DiaryEntity, (diary) => diary.reportRelation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'diaryId', referencedColumnName: 'diaryId' })
  diaryIdRelation: DiaryEntity;
}
