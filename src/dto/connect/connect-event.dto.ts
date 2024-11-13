import { IsNumber } from "class-validator";

export class ConnectEventDto {
  @IsNumber()
  id: number;
}
  