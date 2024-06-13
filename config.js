module.exports = {
  mongodb: {
    server: 'cluster0.9tnfaz1.mongodb.net',
    port: 27017,
    ssl: true,
    auth: {
      user: 'roaders_admin',
      password: 'tmslrd4nBO9tQ7b5',
      authdb: 'admin',
    },
  },
  site: {
    baseUrl: '/',
    cookieKeyName: 'mongo-express',
    cookieSecret: 'cookiesecret',
    host: '127.0.0.1',
    port: 8081,
    requestSizeLimit: '50mb',
    sessionSecret: 'sessionsecret',
    sslEnabled: false,
    useBasicAuth: true,
    basicAuth: {
      username: 'roaders_admin',
      password: 'tmslrd4nBO9tQ7b5',
    },
  },
};
