const crypto = require('crypto')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth management
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * path:
 *  /auth/register:
 *    post:
 *      summary: Register new user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body
  console.log(name, email, password)
  const user = await User.create({
    name,
    email,
    password
  })

  sendTokenResponse(user, 200, res)
})

/**
 * @swagger
 * path:
 *  /auth/login:
 *    post:
 *      summary: Login user via email and password
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email or password!', 400))
  }

  const user = await (await User.findOne({ email })).isSelected('+password')

  if (!user) {
    return next(new ErrorResponse('Invalid Credentials', 401))
  }

  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Invalid Credentials', 401))
  }

  sendTokenResponse(user, 200, res)
})

/**
 * @swagger
 * path:
 *  /auth/logout:
 *    get:
 *      summary: Logout user
 *      tags: [Auth]
 *      responses:
 *        "200":
 *          description: None
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  })
})

/**
 * @swagger
 * path:
 *  /auth/me:
 *    get:
 *      summary: Get user details by JWT
 *      tags: [Auth]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(res.params.id)

  res.status(200).json({
    success: true,
    data: user
  })
})

/**
 * @swagger
 * path:
 *  /auth/updatedetails:
 *    post:
 *      summary: Update user email and/or name
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  })

  if (!user) {
    return next(
      new ErrorResponse(`Unable to find user with id of ${req.user.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    data: user
  })
})

/**
 * @swagger
 * path:
 *  /auth/updatepassword:
 *    post:
 *      summary: Update user password
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                currentPassword:
 *                  type: string
 *                newPassword:
 *                  type: string
 *      responses:
 *        "200":
 *          description: None
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await (await User.findById(req.user.id)).isSelected('+password')

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401))
  }

  user.password = req.body.newPassword

  await user.save()

  sendTokenResponse(user, 200, res)
})

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJWTToken()

  res.status(statusCode).json({
    success: true,
    token
  })
}
