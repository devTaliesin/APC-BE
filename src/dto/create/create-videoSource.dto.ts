import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateVideoSourceDto {
  @IsString()
  @ApiProperty()
  onvif: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  rtsp?: string;

  @IsString()
  @ApiProperty()
  user: string;

  @IsString()
  @ApiProperty()
  pass: string;
}
