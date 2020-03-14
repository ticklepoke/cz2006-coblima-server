const mongoose = require('mongoose')
const slugify = require('slugify')

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    require: [true, 'Please add a course title!']
  },
  slug: String,
  courseCode: {
    type: String,
    trim: true,
    require: [true, 'Please add a course code!']
  },
  description: {
    type: String,
    required: [true, 'Please add a course description!']
  },
  academicUnits: {
    type: Number,
    default: 0,
    required: [true, 'Please add AUs']
  },
  prerequisite: [this], // self reference to other courses
  pe: {
    type: Boolean,
    default: true,
    required: [true, 'Please indicate PE availability!']
  },
  ue: {
    type: Boolean,
    default: true,
    required: [true, 'Please indicate UE availability!']
  },
  averageRating: {
    type: Number,
    min: 1,
    max: 5
  }
})

// Create course slug from name: "course name" becomes "course-name"
CourseSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true })
  next()
})

// Delete all related reviews when course is deleted
CourseSchema.pre('remove', async function(next) {
  console.log(`Related reviews being removed for course ${this._id}`)
  await this.model('Review').deleteMany({ course: this._id })
  next()
})

module.exports = mongoose.model('Course', CourseSchema)
