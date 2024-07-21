import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ReportReasonEnum } from '../enum/enum';
import { ApiProperty } from '@nestjs/swagger';

export class ReportInfoDto {
  @ApiProperty({ type: 'number', description: '신고 당한 다이어리 ID', example: 1 })
  @IsNumber()
  diaryId: number;

  @ApiProperty({ type: Object.values(ReportReasonEnum), description: '신고사유코드', example: 'REP_RSN_001' })
  @IsNotEmpty({ message: '신고사유코드 입력은 필수입니다' })
  @IsEnum(ReportReasonEnum, { message: '신고사유코드에 대한 유효하지 않은 값이 입력되었습니다.' })
  reasonCode: ReportReasonEnum;
}
