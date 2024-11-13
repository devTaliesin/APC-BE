// src/video-source/dto/create-video-source.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateVideoSourceDto {
  @IsString()
  ip: string;

  @IsNumber()
  port: number;

  @IsString()
  name: string;

  @IsString()
  user: string;

  @IsString()
  pass: string;
}
