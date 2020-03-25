const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')
const axios = require('axios')
if (process.env.NODE_ENV !== 'production') dotenv.config()

const Course = require('./models/Course')
const User = require('./models/User')
const Review = require('./models/Review')

// let connectionString
// if (process.env.NODE_ENV == 'production') {
//   connectionString =
//     'mongodb://' +
//     process.env.MONGO_USER +
//     ':' +
//     process.env.MONGO_PW +
//     '@mongo:27017/prod?retryWrites=true&w=majority'
// } else {
//   connectionString =
//     'mongodb+srv://mongo:' +
//     process.env.MONGO_PW +
//     '@cluster0-lnewo.gcp.mongodb.net/test?retryWrites=true&w=majority'
// }
// console.log(connectionString)
// ;(async function() {
//   await mongoose.connect(
//     connectionString,
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true
//     },
//     (error, db) => {
//       if (error) console.log(error)
//       else console.log('Connected to MongoDB!'.bgRed)
//     }
//   )
// })()

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
)

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
)

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
)

exports.importData = async () => {
  try {
    await User.create(users)
    await Review.create(reviews)
    // await Course.create(courses)
    console.log('Data Imported!'.green.inverse)
    // process.exit()
  } catch (err) {
    console.error(err)
  }
}

exports.importCourseData = async () => {
  axios
    .get('https://api.ntuvibe.com/courses/get_course_list')
    .then(res => {
      console.log('Data Fetched from External API')
      const courses = res.data.data.filter(course => {
        return course.code.startsWith('CZ')
      })

      courses.forEach(course => {
        console.log(`Fetching Data for course: ${course.code}`)
        axios
          .get(
            `https://api.ntuvibe.com/courses/get_course_detail?code=${course.code}`
          )
          .then(async res => {
            const {
              title,
              description,
              au,
              as_pe,
              as_ue,
              prerequisite
            } = res.data.data
            if (course.code === 'CZ2006') {
              const courseResult = {
                _id: '5e74cebb368ae6035b6aa307',
                title,
                courseCode: course.code,
                description,
                academicUnits: au,
                pe: as_pe,
                ue: as_ue,
                prerequisite
              }
              await Course.create(courseResult)
            } else {
              const courseResult = {
                title,
                courseCode: course.code,
                description,
                academicUnits: au,
                pe: as_pe,
                ue: as_ue
              }
              await Course.create(courseResult)
            }
          })
          .catch(err => {
            console.log(err)
          })
      })
      console.log('Courses added!'.green.inverse)
      // process.exit()
    })
    .catch(err => console.log(err))
  // process.exit()
}

exports.deleteData = async () => {
  try {
    await User.deleteMany()
    await Course.deleteMany()
    await Review.deleteMany()
    console.log('Data Deleted!'.red.inverse)
    //  process.exit()
  } catch (err) {
    console.error(err)
  }
}
// if (process.argv[2] === '-i') {
//   importData()
// } else if (process.argv[2] === '-d') {
//   deleteData()
// } else if (process.argv[2] === '-c') {
//   importCourseData()
// } else {
//   console.log(
//     '=== Data Seeder === \n Usage: \n node seeder [options] \n -i: \t import data \n -d: \t delete data \n -c: \t import course data'
//   )
//   process.exit()
// }
