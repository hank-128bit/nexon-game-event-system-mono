import { Logger } from '@nestjs/common';

export class AuthServiceLogger extends Logger {
  constructor(name: string) {
    super(`AuthServiceLogger/${name}`);
  }
}
