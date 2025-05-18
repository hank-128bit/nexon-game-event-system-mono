import { validateEnvName } from '../util/validate_envs';
import { RedisOptions } from '../core/redis/interfaces';

export default () => {
  const stage = process.env.ENV_NAME || 'local';
  validateEnvName(stage);

  const authServiceConfig = {
    host: process.env.AUTH_SERVER_HOST || 'localhost',
    port: +process.env.AUTH_SERVER_PORT,
  };

  const redisConfig: RedisOptions = {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || 'passw@rd',
    maxConnections: +(process.env['MAX_REDIS_CONNECTION'] || '30'),
    isCluster: false,
    enableDebug: stage !== 'production' && stage !== 'prod',
    exitProcessOnConnectionError: false,
    socket: {
      retryCount: 10,
      interval: 3000,
    },
  };

  return {
    stage,
    redisConfig,
    authServiceConfig,
  };
};
