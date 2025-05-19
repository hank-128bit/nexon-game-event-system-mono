import { Logger } from '@nestjs/common';

export class EventServiceLogger extends Logger {
  constructor(name: string) {
    super(`EventServiceLogger/${name}`);
  }
}
