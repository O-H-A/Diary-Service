import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ReportEntity } from './report.entity';

@Entity('report_reason')
export class ReportReasonEntity {
  @PrimaryColumn({ name: 'reason_code', nullable: false })
  reasonCode: string;

  @Column({ name: 'reason_name', nullable: false })
  reasonName: string;

  @OneToMany(() => ReportEntity, (report) => report.reasonCodeRelation)
  reportRelation: ReportEntity;
}
