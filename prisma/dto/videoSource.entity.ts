
import {ApiProperty} from '@nestjs/swagger'
import {Event} from './event.entity'


export class VideoSource {
  @ApiProperty({
  type: `integer`,
  format: `int32`,
})
id: number ;
onvif: string ;
name: string  | null;
rtsp: string  | null;
events?: Event[] ;
}
