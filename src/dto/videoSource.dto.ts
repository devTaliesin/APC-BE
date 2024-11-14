
import {ApiProperty} from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator';
export class VideoSourceDto {
  @IsNumber()
  @ApiProperty({
  type: `integer`,
  format: `int32`,
  })
  id: number ;

  @IsString()
  @ApiProperty()
  onvif: string ;

  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  rtsp?: string ;
}
