import { HttpStatus } from '@nestjs/common';

export class BaseError extends Error {
  public type = 'Default';
  public logLevel: 'debug' | 'log' | 'warn' | 'error' = 'warn';
  public readonly code: number;

  constructor(message: string, code?: number) {
    super(message);
    this.code = code ?? HttpStatus.INTERNAL_SERVER_ERROR;
  }

  public getName() {
    return this.constructor.name;
  }
}
