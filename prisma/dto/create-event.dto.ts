
import {Inandout,Sex} from '@prisma/client'
import {ApiProperty,getSchemaPath} from '@nestjs/swagger'




export class CreateEventDto {
  cropImage: string;
@ApiProperty({
  enum: Inandout,
})
inandout?: Inandout;
@ApiProperty({
  enum: Sex,
})
sex?: Sex;
}
