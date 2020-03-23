const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review')
const Course = require('../models/Course')

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management
 */

/**
 * @swagger
 * path:
 *  /reviews:
 *    get:
 *      summary: Get all reviews
 *      tags: [Reviews]
 *      responses:
 *        "200":
 *          description: A review schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Review'
 */
/**
 * @swagger
 * path:
 *  /courses/{courseID}/reviews:
 *    get:
 *      summary: Get all reviews under a particular course
 *      tags: [Reviews]
 *      parameters:
 *        - in: path
 *          name: courseID
 *          schema:
 *            type: integer
 *          required: true
 *          description: Numeric ID of course to get reviews for
 *      responses:
 *        "200":
 *          description: A course schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Course'
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.courseID) {
    const reviews = await Review.find({ course: req.params.courseID })

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } else if (req.params.userID) {
    const reviews = await Review.find({ user: req.params.userID })
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

/**
 * @swagger
 * path:
 *  /reviews/{id}:
 *    get:
 *      summary: Get review by ID
 *      tags: [Reviews]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: Numeric ID of review to get
 *      responses:
 *        "200":
 *          description: A review schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Review'
 */
exports.getReview = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorResponse('No review ID specified', 404))
  }

  const review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(
        `Could not find review with id of ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({
    success: true,
    data: review
  })
})

/**
 * @swagger
 * path:
 *  /courses/{courseID}/reviews:
 *    post:
 *      summary: Create new review for a particular course
 *      tags: [Reviews]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Review'
 *      responses:
 *        "200":
 *          description: A review schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Review'
 */
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.course = req.params.courseID
  req.body.user = req.user.id

  const course = await Course.findById(req.params.courseID)

  if (!course) {
    return next(
      new ErrorResponse(
        `Could not find course with the id of ${req.params.courseID}`,
        404
      )
    )
  }

  const review = await Review.create(req.body)

  res.status(200).json({
    success: true,
    data: review
  })
})

/**
 * @swagger
 * path:
 *  /reviews/{id}:
 *    put:
 *      summary: Update an existing review by ID
 *      tags: [Reviews]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Review'
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: Numeric ID of review to update
 *      responses:
 *        "200":
 *          description: A review schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Review'
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(
        `Could not find review with the id of ${req.params.id}`,
        404
      )
    )
  }

  //   if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //     return next(new ErrorResponse(`Not authorized to update review`, 401));
  //   }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    data: review
  })
})

/**
 * @swagger
 * path:
 *  /reviews/{id}:
 *    delete:
 *      summary: Find and delete an existing review by ID
 *      tags: [Reviews]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: Numeric ID of review to delete
 *      responses:
 *        "200":
 *          description: A review schema
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  data:
 *                    type: object
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(
        `Could not find review with the id of ${req.params.id}`,
        404
      )
    )
  }
  //   if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //     return next(new ErrorResponse(`Not authorized to update review`, 401));
  //   }

  await review.remove()

  res.status(200).json({
    success: true,
    data: {}
  })
})
