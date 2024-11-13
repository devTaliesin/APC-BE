import { IsNumber, IsString } from "class-validator";

  export class ConnectVideoSourceDto {
    @IsNumber()
    id: number;

    @IsString()
    onvif?: string;
  }
