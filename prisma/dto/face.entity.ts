
import {ApiProperty} from '@nestjs/swagger'
import {Event} from './event.entity'


export class Face {
  @ApiProperty({
  type: `integer`,
  format: `int32`,
})
id: number ;
embeddedFace: string ;
events?: Event[] ;
}
