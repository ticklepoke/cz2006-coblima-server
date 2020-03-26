const mongoose = require('mongoose')

/**
 * @swagger
 *   components:
 *     schemas:
 *       Review:
 *         type: object
 *         required:
 *           - title
 *           - description
 *           - rating
 *           - user
 *           - course
 *         properties:
 *           title:
 *             type: string
 *           description:
 *             type: string
 *           rating:
 *             type: number
 *            edited:
 *              type: boolean
 *           user:
 *             $ref: '#/components/schemas/User'
 *           course:
 *             $ref: '#/components/schemas/Course'
 */
const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review!'],
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Please add a description!']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: [true, 'Please add a rating between 0 and 5!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  edited: {
    type: Boolean,
    default: false
  }
})

// static method to get average rating and save
ReviewSchema.statics.getAverageRating = async function(courseID) {
  const obj = await this.aggregate([
    {
      $match: { course: courseID }
    },
    {
      $group: {
        _id: '$course',
        averageRating: { $avg: '$rating' }
      }
    }
  ])

  try {
    await this.model('Course').findByIdAndUpdate(courseID, {
      averageRating: obj[0].averageRating
    })
  } catch (err) {
    console.log(err)
  }
}

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.course)
})

// Call getAverageRating before remove
ReviewSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.course)
})

module.exports = mongoose.model('Review', ReviewSchema)
