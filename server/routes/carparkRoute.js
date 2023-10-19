const express = require('express')
const router = express.Router()
const carparkController = require('../controller/carparkController')

// OPTIONAL PARAMETER: /carpark/retrieve/address?address=""
router.get('/retrieve', carparkController.retrieveByAddress)
// NO PARAMETER: stored in session anyways
router.get('/retrieve/account', carparkController.retrieveByAccount)
router.post('/save', carparkController.save) // save carpark
router.post('/remove', carparkController.remove) // remove saved carpark

module.exports = router