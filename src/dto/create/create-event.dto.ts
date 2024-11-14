
import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectVideoSourceDto } from '../connect/connect-videoSource.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @IsString()
  @ApiProperty()
  cropImage: string;
  
  @ValidateNested()
  @ApiProperty()
  @Type(()=> ConnectVideoSourceDto)
  video: ConnectVideoSourceDto
}
