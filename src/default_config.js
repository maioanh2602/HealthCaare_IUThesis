module.exports = {
  swagger: '2.0',
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },

  info: {
    version: '1.0.0',
    title: 'UI API',
    description: 'A sample API',
    termsOfService: 'http://swagger.io/terms/',
    contact: {
      name: 'You',
    },
    license: {
      name: 'MIT',
    },
  },

  paths: {},
  definitions: {},
  basePath: '/',
  schemes: [
    'http',
    'https',
  ],
  consumes: [
    'application/json',
  ],
  produces: [
    'application/json',
  ],
};
