
import {Inandout,Sex} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'
import {VideoSource} from './videoSource.entity'
import {Face} from './face.entity'

export class Event {
  @ApiProperty({
    type: `integer`,
    format: `int32`,
  })
  id: number ;

  @ApiProperty({
    type: `integer`,
    format: `int32`,
  })
  videoId: number ;
  video?: VideoSource ;

  @ApiProperty({
    type: `string`,
    format: `date-time`,
  })
  datetime: Date ;

  cropImage: string ;

  @ApiProperty({
    type: `integer`,
    format: `int32`,
  })
  faceId: number  | null;
  face?: Face  | null;
  @ApiProperty({
    enum: Inandout,
  })
  inandout: Inandout  | null;

  @ApiProperty({
    enum: Sex,
  })
  sex: Sex  | null;
}
