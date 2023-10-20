const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')

router.post('/signup', authController.signup) // create new account
router.post('/login', authController.login) // login to account
router.post('/logout', authController.logout) // logout of account
router.post('/updatePw', authController.updatePw) // change password of account

module.exports = router