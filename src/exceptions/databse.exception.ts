import { HttpException, HttpStatus } from "@nestjs/common";

export class DatabaseConnectionException extends HttpException {
  constructor() {
    super('Failed to connect to the database', HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class DatabaseTimeoutException extends HttpException {
  constructor() {
    super('Database request timed out', HttpStatus.REQUEST_TIMEOUT);
  }
}

export class DatabaseQueryException extends HttpException {
  constructor() {
    super('Error executing database query', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class DatabaseTransactionException extends HttpException {
  constructor() {
    super('Error in database transaction', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class DatabaseRecordNotFoundException extends HttpException {
  constructor() {
    super('Record not found in the database', HttpStatus.NOT_FOUND);
  }
}

export function handleDatabaseException(error: any) {
  if (error.code === 'P2025') {
    throw new DatabaseRecordNotFoundException();
  } else if (error.message.includes('connection')) {
    throw new DatabaseConnectionException();
  } else if (error.message.includes('timeout')) {
    throw new DatabaseTimeoutException();
  } else if (error.message.includes('transaction')) {
    throw new DatabaseTransactionException();
  } else {
    throw new DatabaseQueryException();
  }
}