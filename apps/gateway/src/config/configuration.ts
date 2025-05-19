import { RedisOptions } from '@libs/redis/interfaces/redis-options.interface';
import { validateEnvName } from '../util/validate_envs';

export default () => {
  const stage = process.env.ENV_NAME || 'local';
  validateEnvName(stage);

  const authServiceConfig = {
    host: process.env.AUTH_SERVER_HOST || 'localhost',
    port: +process.env.AUTH_SERVER_PORT,
  };

  const jwtConfig = {
    secret: process.env.JWT_SECRET,
  };

  const redisConfig: RedisOptions = {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    maxConnections: parseInt(process.env['MAX_REDIS_CONNECTION'] || '30'),
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
    authServiceConfig,
    jwtConfig,
    redisConfig,
  };
};
