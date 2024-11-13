export class OnvifConnectionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'OnvifConnectionError';
  }
}

export class OnvifAuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'OnvifAuthenticationError';
  }
}

export class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
  }
}
