import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { DiaryReportEntity } from './diary-report.entity';

@Entity('report_reason')
export class ReportReasonEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  code: string;

  @Column({ type: 'varchar', nullable: false })
  reasonName: string;

  @OneToMany(() => DiaryReportEntity, (report) => report.reasonCodeRelation)
  reportRelation: DiaryReportEntity[];
}
