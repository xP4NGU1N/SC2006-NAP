const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')

router.post('/signup', authController.signup) // create new account
router.post('/login', authController.login) // login to account
router.post('/requestNewPassword', authController.requestNewPassword) // request change password of account
router.post('/verifyPasswordRequestAndUpdate', authController.verifyPasswordRequestAndUpdate) // verify email code and change password
router.post('/logout', authController.logout) // logout of account

module.exports = router