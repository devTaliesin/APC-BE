
import {Inandout,Sex} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'


export class EventDto {
  @ApiProperty({
  type: `integer`,
  format: `int32`,
})
id: number ;
@ApiProperty({
  type: `string`,
  format: `date-time`,
})
datetime: Date ;
cropImage: string ;
@ApiProperty({
  enum: Inandout,
})
inandout: Inandout  | null;
@ApiProperty({
  enum: Sex,
})
sex: Sex  | null;
}
