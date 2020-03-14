const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const colors = require('colors')
const swaggerConfig = require('./config/swaggerConfig')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const errorHandler = require('./middleware/error')

const app = express()
// connectDB()

const NODE_ENV = process.env.NODE_ENV || 'development'

if (process.env.NODE_ENV != 'production') {
  dotenv.config()
  app.use(morgan('dev'))
}

app.use(cors())
app.use(cookieParser())
app.use(helmet())
app.use(mongoSanitize())
app.use(hpp())
app.use(xss())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100 // max 100 requests per 10 min
})
app.use(limiter)

/**
 * Static file routes
 */
app.use(express.static(path.join(__dirname, 'public')))

/**
 * Setup API Documents
 */
const swaggerSpec = swaggerJSDoc(swaggerConfig)
app.use('/', swaggerUI.serve)
app.get('/', swaggerUI.setup(swaggerSpec, { explorer: true }))

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`App running on port ${PORT} in ${NODE_ENV} mode`.bgGray)
})

// Handle unhandle promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
})
