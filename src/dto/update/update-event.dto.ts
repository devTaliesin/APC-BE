
import {Inandout,Sex} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'
import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectFaceDto } from '../connect/connect-face.dto';
export class UpdateEventDto {
  @IsNumber()
  id: number;

  @ValidateNested()
  @Type(()=>ConnectFaceDto)
  face: ConnectFaceDto;
  
  @ApiProperty({
    enum: Inandout,
  })
  inandout?: Inandout;

  @ApiProperty({
    enum: Sex,
  })
  sex?: Sex;
}
