const mongoose = require('mongoose')

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
  }
})

module.exports = mongoose.model('Review', ReviewSchema)
