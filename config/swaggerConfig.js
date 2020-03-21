const swaggerConfig = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'CZ2006 API',
      version: '1.0.0',
      description: "APIs for CZ2006. NOTE: prefix all routes with '/api/v1/'",
      license: {
        name: 'MIT',
        url: 'https://choosealicense.com/licenses/mit/'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1'
      },
      {
        url: 'http://35.240.245.213/api/v1'
      }
    ]
  },
  apis: [
    './controllers/courses.js',
    './controllers/reviews.js',
    './controllers/auth.js',
    './models/Course.js',
    './models/User.js',
    './models/Review.js'
  ]
}

module.exports = swaggerConfig
