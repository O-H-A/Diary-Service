import { ApiProperty } from '@nestjs/swagger';
import { ReportActionEnum } from '../enum/enum';
import { IsEnum, IsNumber } from 'class-validator';

export class ActionInfoDto {
  @ApiProperty({ type: 'number', description: '산고ID', example: 1 })
  @IsNumber()
  reportId: number;

  @ApiProperty({
    isArray: true,
    description: '신고 조치 코드 리스트',
    example: ['REP_ACT_001', 'REP_ACT_003'],
  })
  @IsEnum(ReportActionEnum, { each: true })
  actionCodes: ReportActionEnum[];
}
