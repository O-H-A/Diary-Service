import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { WeatherType } from '../enums/weather.enum';

export class CreateDiaryDto {
  @ApiProperty()
  @IsNotEmpty({ message: '날짜 등록은 필수입니다' })
  @IsString()
  readonly setDate: string;

  @ApiProperty()
  @IsNotEmpty({ message: '제목 입력은 필수입니다' })
  @IsString()
  @MaxLength(150, { message: '최대 150자입니다' })
  readonly title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(300, { message: '최대 300자입니다' })
  readonly content?: string;

  @ApiProperty()
  @IsNotEmpty({ message: '날씨 등록은 필수입니다' })
  @IsEnum(Object.values(WeatherType), { message: '날씨에 대한 유효하지 않은 값이 입력되었습니다.' })
  readonly weather: WeatherType;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly isPublic?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly location?: string;
}
