import { IsOptional, IsString } from 'class-validator';

export class ResponseDto {
  @IsString()
  message: string;

  @IsOptional()
  data?: any;
}
