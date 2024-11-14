
import {ApiProperty} from '@nestjs/swagger'
export class VideoSourceDto {
  @ApiProperty({
  type: `integer`,
  format: `int32`,
  })
  id: number ;

  @ApiProperty()
  onvif: string ;

  @ApiProperty()
  name: string  | null;

  @ApiProperty()
  rtsp: string  | null;
}
