export const validateEnvName = (envName: string) => {
  if (!['local', 'dev', 'prod'].includes(envName)) {
    throw new Error(`ENV_NAME is not set. It must be one of ${['local', 'dev', 'prod'].join(', ')}`);
  }
};
