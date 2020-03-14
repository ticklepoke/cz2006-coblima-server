const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const swaggerConfig = require('./config/swaggerConfig')
const connectDB = require('./config/db')
const dotenv = require('dotenv')

if (process.env.NODE_ENV != 'production') dotenv.config()

// connectDB()
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const swaggerSpec = swaggerJSDoc(swaggerConfig)

app.use(express.static(path.join(__dirname, 'public')))

app.use('/docs', swaggerUI.serve)
app.get('/docs', swaggerUI.setup(swaggerSpec, { explorer: true }))

app.get('/', (req, res) => {
  res.send('<h1>Welcome to CZ2006 COBLIMA</h1>')
})

app.listen(5000, () => {
  console.log('App running on port 5000')
})
