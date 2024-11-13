
import {ApiProperty} from '@nestjs/swagger'


export class FaceDto {
  
  @ApiProperty({
    type: `integer`,
    format: `int32`,
  })
  id: number ;

  embeddedFace: string ;
}
