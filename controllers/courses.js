const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Course = require('../models/Course')

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 */

/**
 * @swagger
 * path:
 *  /courses:
 *    get:
 *      summary: Get all courses
 *      tags: [Courses]
 *      parameters:
 *        - in: query
 *          name: search
 *          type: string
 *          description: Course code or name to search by
 *      responses:
 *        "200":
 *          description: A course schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Course'
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.originalUrl == '/api/v1/courses//') {
    return next(new ErrorResponse(`Invalid url`, 400))
  }
  if (req.query.search) {
    const searchKey = new RegExp(req.query.search, 'i')
    const coursesByTitle = await Course.find({
      title: searchKey
    })
    const coursesByCode = await Course.find({
      courseCode: searchKey
    })
    const courses = coursesByCode.concat(coursesByTitle)

    if (!courses) {
      return next(
        new ErrorResponse(
          `Could not find any courses matching ${req.query.search}`,
          404
        )
      )
    }
    return res.status(200).json({
      success: true,
      data: courses
    })
  } else {
    return res.status(200).json(res.advancedResults)
  }
})

/**
 * @swagger
 * path:
 *  /courses/{id}:
 *    get:
 *      summary: Get course by ID
 *      tags: [Courses]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: Numeric ID of course to get
 *      responses:
 *        "200":
 *          description: A course schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Course'
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  console.log('here1')
  if (!req.params.id) {
    return next(new ErrorResponse('No course ID specified', 404))
  }
  if (req.params.id === '/') {
    console.log('here')
  }
  const course = await Course.findById(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(
        `No course with the id of ${req.paramas.id} found!`,
        404
      )
    )
  }

  res.status(200).json({
    success: true,
    data: course
  })
})

/**
 * @swagger
 * path:
 *  /courses:
 *    post:
 *      summary: Create new course
 *      tags: [Courses]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Course'
 *      responses:
 *        "200":
 *          description: A course schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Course'
 */
exports.addCourse = asyncHandler(async (req, res, next) => {
  // req.body.user = req.user.id

  const course = await Course.create(req.body)

  if (!course) {
    return next(new ErrorResponse(`Unable to create course`, 500))
  }
  res.status(200).json({
    success: true,
    data: course
  })
})

/**
 * @swagger
 * path:
 *  /courses/{id}:
 *    put:
 *      summary: Update an existing course by ID
 *      tags: [Courses]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Course'
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: Numeric ID of course to update
 *      responses:
 *        "200":
 *          description: A course schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Course'
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(
        `Could not find course with id of ${req.params.id}`,
        404
      )
    )
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    data: course
  })
})

/**
 * @swagger
 * path:
 *  /courses/{id}:
 *    delete:
 *      summary: Find and delete an existing course by ID
 *      tags: [Courses]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: Numeric ID of course to delete
 *      responses:
 *        "200":
 *          description: A course schema
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
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = Course.findById(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(
        `Could not find course with id of ${req.params.id}`,
        404
      )
    )
  }

  await course.remove()

  res.status(200).json({
    success: true,
    data: {}
  })
})
