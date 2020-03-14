const mongoose = require('mongoose')

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

// Delete all Reviews made by this user when user is deleted
UserSchema.pre('remove', async function(next) {
  console.log(`Related reviews being removed for user ${this._id}`)
  await this.model('Review').deleteMany({ user: this._id })
  next()
})

module.exports = mongoose.model('User', UserSchema)
