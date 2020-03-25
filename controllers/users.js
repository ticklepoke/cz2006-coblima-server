const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')

exports.getUserDetails = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorResponse(`No ID specified`, 404))
  }

  const user = await User.findById(req.params.id)

  if (!user) {
    return next(
      new ErrorResponse(`No user found with ID: ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    data: user
  })
})
