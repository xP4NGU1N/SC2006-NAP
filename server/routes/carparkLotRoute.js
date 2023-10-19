const express = require('express')
const router = express.Router()
const carparkLotController = require('../controller/carparkLotController')

router.get('/retrieve', carparkLotController.retrieve) // get parking lot and carpark details
router.post('/save', carparkLotController.save) // save parking lot
router.post('/remove', carparkLotController.remove) // remove saved parking lot

module.exports = router