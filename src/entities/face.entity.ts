
import {ApiProperty} from '@nestjs/swagger'
import {Event} from './event.entity'
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export class Face {
  @IsNumber()
  @ApiProperty({
  type: `integer`,
  format: `int32`,
  })
  id: number ;

  @IsString()
  @ApiProperty()
  embeddedFace: string ;
  
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Event)
  @ApiProperty()
  events?: Event[] ;
}
