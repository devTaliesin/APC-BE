import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class ConnectEventDto {
  @IsNumber()
  @ApiProperty()
  id: number;
}
  