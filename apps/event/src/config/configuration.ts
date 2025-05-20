import { RedisOptions } from '@libs/redis/interfaces';

export default () => {
  const stage = process.env.ENV_NAME || 'local';

  const databaseConfig = {
    uri: process.env.DB_URI,
    database: process.env.DB_DATABASE || 'public',
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
    databaseConfig,
    redisConfig,
  };
};
