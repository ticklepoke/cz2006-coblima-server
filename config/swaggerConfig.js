const swaggerConfig = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'CZ2006 API',
      version: '1.0.0',
      description: 'APIs for CZ2006',
      license: {
        name: 'MIT',
        url: 'https://choosealicense.com/licenses/mit/'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1'
      }
    ]
  },
  apis: [
    './models/Course.js',
    './models/User.js',
    './models/Review.js',
    './controllers/sample.js'
  ]
}

module.exports = swaggerConfig
