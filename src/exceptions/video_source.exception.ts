import { HttpException, HttpStatus } from "@nestjs/common";

export class OnvifConnectionException extends HttpException {
  constructor() {
    super(`can't connect OnVif Device`, HttpStatus.BAD_GATEWAY);
  }
}

export class OnvifAuthenticationException extends HttpException {
  constructor() {
    super(`Invalid OnVif ID or Password`, HttpStatus.UNAUTHORIZED);
  }
}

