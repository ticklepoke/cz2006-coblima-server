const express = require('express')
const {
  getCourses,
  addCourse,
  getCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses')
const Course = require('../models/Course')
const router = express.Router()
const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

router
  .route('/')
  .get(advancedResults(Course), getCourses)
  .post(
    // protect, authorize('admin'),
    addCourse
  )

router
  .route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse)

module.exports = router
