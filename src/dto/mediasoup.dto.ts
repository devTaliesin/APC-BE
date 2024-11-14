import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsIn, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

// RtpParametersDto
class RtcpFeedbackDto {
  @IsString()
  type: string;

  @IsString()
  parameter: string;
}

class RtpCodecParametersDto {
  @IsString()
  mimeType: string;

  @IsNumber()
  payloadType: number;

  @IsNumber()
  clockRate: number;

  @IsObject()
  parameters: Record<string, string>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RtcpFeedbackDto)
  rtcpFeedback: RtcpFeedbackDto[];
}

class RtpEncodingParametersDto {
  @IsOptional()
  @IsNumber()
  ssrc?: number;
}

export class RtpParametersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RtpCodecParametersDto)
  codecs: RtpCodecParametersDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RtpEncodingParametersDto)
  encodings: RtpEncodingParametersDto[];
}


// DtlsParametersDto
enum DtlsRole {
  AUTO = 'auto',
  CLIENT = 'client',
  SERVER = 'server',
}

class DtlsFingerprintDto {
  @IsIn(['sha-1', 'sha-224', 'sha-256', 'sha-384', 'sha-512'], {
    message: 'algorithm must be a valid fingerprint algorithm',
  })
  algorithm: 'sha-1' | 'sha-224' | 'sha-256' | 'sha-384' | 'sha-512';

  @IsString()
  value: string;
}

export class DtlsParametersDto {
  @IsEnum(DtlsRole)
  role: DtlsRole;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DtlsFingerprintDto)
  fingerprints: DtlsFingerprintDto[];
}

// RtpCapabilitiesDto


class RtpCodecCapabilityDto {
  @IsIn(['audio', 'video'])
  kind: 'audio' | 'video';
  
  @IsString()
  mimeType: string;

  @IsNumber()
  preferredPayloadType?: number;

  @IsNumber()
  clockRate: number;

  @IsNumber()
  channels?: number;
  
  @IsObject()
  parameters?: Record<string, string>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RtcpFeedbackDto)
  rtcpFeedback?: RtcpFeedbackDto[];
}

class RtpHeaderExtensionDto {
  @IsIn(['audio', 'video'])
  kind: 'audio' | 'video';

  @IsIn([
    'urn:ietf:params:rtp-hdrext:sdes:mid', 
    'urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id', 
    'urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id', 
    'http://tools.ietf.org/html/draft-ietf-avtext-framemarking-07', 
    'urn:ietf:params:rtp-hdrext:framemarking', 
    'urn:ietf:params:rtp-hdrext:ssrc-audio-level', 
    'urn:3gpp:video-orientation', 
    'urn:ietf:params:rtp-hdrext:toffset', 
    'http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01', 
    'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time', 
    'http://www.webrtc.org/experiments/rtp-hdrext/abs-capture-time', 
    'http://www.webrtc.org/experiments/rtp-hdrext/playout-delay'
  ])
  uri: 
    'urn:ietf:params:rtp-hdrext:sdes:mid' | 
    'urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id' | 
    'urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id' | 
    'http://tools.ietf.org/html/draft-ietf-avtext-framemarking-07' | 
    'urn:ietf:params:rtp-hdrext:framemarking' | 
    'urn:ietf:params:rtp-hdrext:ssrc-audio-level' | 
    'urn:3gpp:video-orientation' | 
    'urn:ietf:params:rtp-hdrext:toffset' | 
    'http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01' | 
    'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time' | 
    'http://www.webrtc.org/experiments/rtp-hdrext/abs-capture-time' | 
    'http://www.webrtc.org/experiments/rtp-hdrext/playout-delay';

  @IsNumber()
  preferredId: number;

  @IsBoolean()
  preferredEncrypt?: boolean;

  @IsIn(["sendrecv", "sendonly", "recvonly", "inactive"])
  direction?: "sendrecv" | "sendonly" | "recvonly" | "inactive";
}


export class RtpCapabilitiesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(()=>RtpCodecCapabilityDto)
  codecs?: RtpCodecCapabilityDto[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(()=>RtpHeaderExtensionDto)
  headerExtensions?: RtpHeaderExtensionDto[]
}

