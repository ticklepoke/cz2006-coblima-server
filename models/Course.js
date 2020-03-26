const mongoose = require('mongoose')
const slugify = require('slugify')

/**
 * @swagger
 *  components:
 *    schemas:
 *      Course:
 *        type: object
 *        required:
 *          - title
 *          - courseCode
 *          - description
 *          - academicUnits
 *          - pe
 *          - ue
 *        properties:
 *          title:
 *            type: string
 *          courseCode:
 *            type: string
 *            description: Course code according to NTU's alphanumeric course code
 *          description:
 *            type: string
 *          academicUnits:
 *            type: number
 *            description: Academic Units awarded for the course
 *          prerequisite:
 *            type: array
 *            items:
 *              type: string
 *            description: Prequisite courses needed to enroll in this course
 *          pe:
 *            type: boolean
 *            description: Whether this course is offered as a PE
 *          ue:
 *            type: boolean
 *            description: Whether this course is offered as a UE
 *        examples:
 *           title: 'Software Engineering'
 *           courseCode: CZ2006
 *           description: An undergraduate course on software engineering
 *           academicUnits: 3
 *           prerequisite: CZ1000
 *           pe: false
 *           ue: false
 */
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
    required: [true, 'Please add a course description!'],
    unique: true
  },
  academicUnits: {
    type: Number,
    default: 0,
    required: [true, 'Please add AUs']
  },
  prerequisite: {
    type: String,
    required: true
  }, // self reference to other courses
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
