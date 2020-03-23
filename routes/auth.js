const express = require('express')
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword
} = require('../controllers/auth')

const router = express.Router({ mergeParams: true })
const { protect } = require('../middleware/auth')

const reviewrouter = require('./reviews')
router.use('/:userID/reviews', reviewrouter)

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)

module.exports = router
