export default () => {
  const stage = process.env.ENV_NAME || 'local';

  const databaseConfig = {
    uri: process.env.DB_URI,
    database: process.env.DB_DATABASE || 'public',
  };

  return {
    stage,
    databaseConfig,
  };
};
