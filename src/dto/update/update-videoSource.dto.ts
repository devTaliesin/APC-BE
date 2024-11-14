import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateVideoSourceDto {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  onvif?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  rtsp?: string;
}
