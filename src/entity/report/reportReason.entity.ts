import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ReportEntity } from './report.entity';

@Entity('report_reason')
export class ReportReasonEntity {
  @PrimaryColumn({ name: 'code', nullable: false })
  reasonCode: string;

  @Column({ name: 'reasonName', nullable: false })
  reasonName: string;

  @OneToMany(() => ReportEntity, (report) => report.reasonCodeRelation)
  reportRelation: ReportEntity;
}
