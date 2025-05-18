import { Inject } from '@nestjs/common';
import { REDIS_CONNECTION } from './constant';

export const InjectRedis = (connectionName?: string) =>
  Inject(connectionName ? `${REDIS_CONNECTION}_${connectionName}` : REDIS_CONNECTION);
