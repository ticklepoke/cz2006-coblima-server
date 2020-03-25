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
const { importCourseData, importData, deleteData } = require('./seeder')

const app = express()

const NODE_ENV = process.env.NODE_ENV || 'development'

if (process.env.NODE_ENV != 'production') {
  dotenv.config()
  app.use(morgan('dev'))
}
console.log(`Attempting to start app in ${process.env.NODE_ENV} mode.`.bgGray)

connectDB()

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

/**
 * Routers
 */
const coursesRouter = require('./routes/courses')
const reviewRouter = require('./routes/reviews')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/users')
app.use('/api/v1/courses', coursesRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)

/**
 * INIT end points
 */
app.get('/api/admin/init/course', async (req, res) => {
  await importCourseData()
  res.sendStatus(200)
})
app.get('/api/admin/init/import', async (req, res) => {
  await importData()
  res.sendStatus(200)
})
app.get('/api/admin/init/delete', async (req, res) => {
  await deleteData()
  res.sendStatus(200)
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`App running on port ${PORT} in ${NODE_ENV} mode`.bgGray)
})

// Handle unhandle promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
})
