import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class ConnectFaceDto {
  @IsNumber()
  @ApiProperty()
  id: number;
}
  