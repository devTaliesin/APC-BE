
import { ConnectEventDto } from '../connect/connect-event.dto';
import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectVideoSourceDto } from '../connect/connect-videoSource.dto';

export class CreateEventDto {
  @IsString()
  cropImage: string;
  
  @ValidateNested()
  @Type(()=> ConnectVideoSourceDto)
  video: ConnectVideoSourceDto
}
