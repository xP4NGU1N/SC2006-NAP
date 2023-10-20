const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')

router.post('/signup', authController.signup) // create new account
router.post('/login', authController.login) // login to account
router.post('/update', authController.updatePassword) // change password of account
router.post('/logout', authController.logout) // logout of account

module.exports = router