
import {Inandout,Sex} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'
import { IsDate, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class EventDto {
  @IsNumber()
  @ApiProperty({
    type: `integer`,
    format: `int32`,
  })
  id: number ;

  @IsDate()
  @ApiProperty({
    type: `string`,
    format: `date-time`,
  })
  datetime: Date ;

  @IsString()
  @ApiProperty()
  cropImage: string ;


  @IsIn(["IN", "OUT"])
  @IsOptional()
  @ApiProperty({ enum: Inandout })
  inandout?: Inandout;

  @IsIn(["MAN", "WOMAN"])
  @IsOptional()
  @ApiProperty({ enum: Sex })
  sex?: Sex;
}
