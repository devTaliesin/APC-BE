
import {Inandout,Sex} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class UpdateEventDto {
  cropImage?: string;
@ApiProperty({
  enum: Inandout,
})
inandout?: Inandout;
@ApiProperty({
  enum: Sex,
})
sex?: Sex;
}
