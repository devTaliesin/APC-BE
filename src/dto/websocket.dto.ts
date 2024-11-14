import { Type } from 'class-transformer';
import { IsIn, IsString, ValidateNested } from 'class-validator';
import { DtlsParametersDto, RtpCapabilitiesDto, RtpParametersDto } from './mediasoup.dto';

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

export class ConsumeDto {
  @IsString()
  producerId: string; 

  @ValidateNested()
  @Type(() => RtpParametersDto)
  rtpCapabilities: RtpCapabilitiesDto;
}

export class ResumeDto { 
  @IsString()
  consumerId: string 
}