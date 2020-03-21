const mongoose = require('mongoose')

const connectDB = async () => {
  let connectionString
  if (process.env.NODE_ENV == 'production') {
    connectionString =
      'mongodb://' +
      process.env.MONGO_USER +
      ':' +
      process.env.MONGO_PW +
      '@mongo:27017/prod?retryWrites=true&w=majority'
  } else {
    connectionString =
      'mongodb+srv://mongo:' +
      process.env.MONGO_PW +
      '@cluster0-lnewo.gcp.mongodb.net/test?retryWrites=true&w=majority'
  }

  console.log(connectionString)
  await mongoose.connect(
    connectionString,
    {
      // useNewUrlParser: true
    },
    (error, db) => {
      if (error) console.log(error)
      else console.log('Connected to MongoDB!'.bgRed)
    }
  )
}

module.exports = connectDB
