export default () => {
  const stage = process.env.ENV_NAME || 'local';

  const databaseConfig = {
    uri: process.env.DB_URI,
    database: process.env.DB_DATABASE || 'public',
  };

  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRE;

  return {
    stage,
    databaseConfig,
    jwtSecret,
    jwtExpiresIn,
  };
};
