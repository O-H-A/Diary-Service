import { ApiProperty } from '@nestjs/swagger';

export class DiariesInfoDto {
  @ApiProperty({ example: [44, 45] })
  diaryIds: number[];
}
