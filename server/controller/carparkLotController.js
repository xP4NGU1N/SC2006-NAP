const carparkLotService = require('../model/service/carparkLotService')

const retrieve = async (req, res) => {
    try {
        const result = await carparkLotService.retrieve(req)
        res.status(200).json(result)
    } catch (error) {
        console.error('Error:', error.message)
        res.status(error.code || 500).json({ error: error.message })
    }
}

const save = async (req, res) => {
    try {
        const { carparkId, carparkLot, remarks } = req.body
        const result = await carparkLotService.save(carparkId, carparkLot, remarks, req)
        res.status(200).json({ message: result })
    } catch (error) {
        console.error('Error:', error.message)
        res.status(error.code || 500).json({ error: error.message })
    }
}

const remove = async (req, res) => {
    try {
        const result = await carparkLotService.remove(req)
        res.status(200).json({ message: result })
    } catch (error) {
        console.error('Error:', error.message)
        res.status(error.code || 500).json({ error: error.message })
    }
}

module.exports = { retrieve, save, remove }