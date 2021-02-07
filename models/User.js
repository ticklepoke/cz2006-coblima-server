const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *           - name
 *           - email
 *           - password
 *        properties:
 *
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *          password:
 *            type: string
 *            format: password
 *
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name!']
  },
  email: {
    type: String,
    required: [true, 'Please add an email!'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Email is invalid!'
    ]
  },
  matriculationNumber: {
    type: String,
    required: [true, 'Please add a matriculation number!']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please add a password!'],
    minlength: 6,
    select: false
  },
  resetPasswordToken: String,
  resetPassWordExpiry: Date,
  registeredDate: {
    type: Date,
    default: Date.now()
  }
})

// Encrypt all passwords before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getSignedJWTToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    // expiresIn: process.env.JWT_EXPIRE
  })
}

// check for matching username and hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// gemerate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // generate token
  const resetToken = crypto.randomBytes(20).toString('hex')
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordExpiry = Date.now() + 10 * 60 * 1000 // 10 mins

  return resetToken
}

// Delete all Reviews made by this user when user is deleted
UserSchema.pre('remove', async function(next) {
  console.log(`Related reviews being removed for user ${this._id}`)
  await this.model('Review').deleteMany({ user: this._id })
  next()
})

module.exports = mongoose.model('User', UserSchema)
