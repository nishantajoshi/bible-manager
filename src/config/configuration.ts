export default () => ({
  port: parseInt(process.env.PORT || '3000', 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
});
