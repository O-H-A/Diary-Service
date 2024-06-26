import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { WeatherType } from '../enums/weather.enum';

export class CreateDiaryDto {
  @ApiProperty({ example: '20240315', description: '예시의 형식을 지켜주세요(년월일)' })
  @IsNotEmpty({ message: '날짜 등록은 필수입니다' })
  @IsString()
  readonly setDate: string;

  @ApiProperty({ example: '제목입니다. 최대 150자', description: '필수 입력 값입니다' })
  @IsNotEmpty({ message: '제목 입력은 필수입니다' })
  @IsString()
  @MaxLength(150, { message: '최대 150자입니다' })
  readonly title: string;

  @ApiProperty({ example: '내용입니다. 최대 300자', description: '선택 입력 값입니다' })
  @IsOptional()
  @IsString()
  @MaxLength(300, { message: '최대 300자입니다' })
  readonly content?: string;

  @ApiProperty({
    example: 'WTHR_PARTLY_CLOUDY',
    description: '필수 입력 값입니다. 날씨 코드를 입력해주세요(존재하지 않는 코드 입력 시 validation 에러)',
  })
  @IsNotEmpty({ message: '날씨 등록은 필수입니다' })
  @IsEnum(Object.values(WeatherType), { message: '날씨에 대한 유효하지 않은 값이 입력되었습니다.' })
  readonly weather: WeatherType;

  @ApiProperty({ type: 'string', format: 'binary', description: '업로드할 파일' })
  readonly file: any;

  @ApiProperty({ example: true, description: '선택 입력 값입니다. 미입력 시 기본 값으로 true(공개)가 저장됩니다' })
  @IsOptional()
  readonly isPublic?: boolean;

  @ApiProperty({ example: '뉴욕', description: '선택 입력 값입니다. string 형식 아무 문장 입력 가능' })
  @IsOptional()
  @IsString()
  readonly location?: string;
}
