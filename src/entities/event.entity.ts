
import {Inandout,Sex} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'
import {VideoSource} from './videoSource.entity'
import {Face} from './face.entity'
import { IsEnum, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Event {
  @IsNumber()
  @ApiProperty({
    type: `integer`,
    format: `int32`,
  })
  id: number ;

  @IsNumber()
  @ApiProperty({
    type: `integer`,
    format: `int32`,
  })
  videoId: number ;
  video?: VideoSource ;

  @IsString()
  @ApiProperty({
    type: `string`,
    format: `date-time`,
  })
  datetime: Date ;

  @IsString()
  @ApiProperty()
  cropImage: string ;

  @IsNumber()
  @ApiProperty({
    type: `integer`,
    format: `int32`,
  })
  
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  faceId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => Face)
  @ApiProperty({
    enum: Face,
  })
  face?: Face;

  @IsOptional()
  @IsIn(["IN", "OUT"])
  @ApiProperty({
    enum: Inandout,
  })
  inandout?: Inandout;

  @IsOptional()
  @IsIn(["MAN", "WOMAN"])
  @ApiProperty({
    enum: Sex,
  })
  sex?: Sex;
}
