
import {Inandout,Sex} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectFaceDto } from '../connect/connect-face.dto';
export class UpdateEventDto {
  @IsNumber()
  @ApiProperty()
  id: number;

  @ValidateNested()
  @ApiProperty()
  @Type(()=>ConnectFaceDto)
  face: ConnectFaceDto;
  

  @IsOptional()
  @ApiProperty({
    enum: Inandout,
  })
  inandout?: Inandout;

  @IsOptional()
  @ApiProperty({
    enum: Sex,
  })
  sex?: Sex;
}
