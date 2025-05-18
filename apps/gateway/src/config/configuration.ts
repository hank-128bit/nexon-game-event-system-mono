import { validateEnvName } from '../util/validate_envs';

export default () => {
  const stage = process.env.ENV_NAME || 'local';
  validateEnvName(stage);

  const authServiceConfig = {
    host: process.env.AUTH_SERVER_HOST || 'localhost',
    port: +process.env.AUTH_SERVER_PORT,
  };

  return {
    stage,
    authServiceConfig,
  };
};
