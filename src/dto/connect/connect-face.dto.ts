import { IsNumber, IsString } from "class-validator";

export class ConnectFaceDto {
  @IsNumber()
  id: number;

  @IsString()
  embeddedFace?: string;
}
  