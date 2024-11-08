
import {ApiProperty} from '@nestjs/swagger'


export class VideoSourceDto {
  @ApiProperty({
  type: `integer`,
  format: `int32`,
})
id: number ;
onvif: string ;
name: string  | null;
rtsp: string  | null;
}
