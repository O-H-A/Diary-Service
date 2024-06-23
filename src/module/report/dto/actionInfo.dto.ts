import { ApiProperty } from '@nestjs/swagger';
import { ReportActionEnum } from '../enum/enum';
import { IsEnum } from 'class-validator';

export class ActionInfoDto {
  @ApiProperty({
    isArray: true,
    enum: ReportActionEnum,
    description: '신고 조치 코드 리스트',
    example: ['REP_ACT_001', 'REP_ACT_003'],
  })
  @IsEnum(ReportActionEnum, { each: true })
  actionCodes: ReportActionEnum[];
}
