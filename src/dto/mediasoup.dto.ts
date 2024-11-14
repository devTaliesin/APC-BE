import { Type } from "class-transformer";
import { IsArray, IsEnum, IsIn, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { types } from "mediasoup";

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