import { Type } from 'class-transformer';
import { IsEnum, IsIn, ValidateNested } from 'class-validator';
import { types } from 'mediasoup';
import { DtlsParametersDto, RtpParametersDto } from './mediasoup.dto';

export class GetRtpParametersDto {
  @IsIn(['audio', 'video'])
  kind: 'audio' | 'video';
}

export class StartProduceDto { 
  @IsIn(['audio', 'video'])
  kind: 'audio' | 'video';

  @ValidateNested()
  @Type(() => RtpParametersDto)
  rtpParameters: RtpParametersDto;
}

export class ConnectWebRtcTransportDto{
  @IsIn(['audio', 'video'])
  kind: 'audio' | 'video';
  dtlsParameters: DtlsParametersDto;
}

