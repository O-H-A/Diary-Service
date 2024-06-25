import { ApiProperty } from '@nestjs/swagger';
import { ReportActionEnum } from '../enum/enum';
import { IsEnum, IsNumber } from 'class-validator';

export class ActionInfoDto {
  @ApiProperty({ type: 'number', description: '산고ID' })
  @IsNumber()
  reportId: number;

  @ApiProperty({
    description: '신고 조치 코드 리스트',
  })
  @IsEnum(ReportActionEnum, { each: true })
  actionCodes: ReportActionEnum[];
}
