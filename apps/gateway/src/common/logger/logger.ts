import { Logger } from '@nestjs/common';

export class GatewayLogger extends Logger {
  constructor(name: string) {
    super(`Gateway/${name}`);
  }
}
