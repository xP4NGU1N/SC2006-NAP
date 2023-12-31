const carparkService = require('../model/service/carparkService')

const retrieveByAddress = async (req, res) => {
    try {
        const address = req.query.address || ""
        const carparks = await carparkService.retrieveByAddress(address, req)
        res.status(201).json(carparks)
    } catch (error) {
        console.error('Error', error.message)
        res.status(error.code || 500).json({ error: error.message })
    }
}

const retrieveByAccount = async (req, res) => {
    try {
        const result = await carparkService.retrieveByAccount(req)
        res.status(200).json(result)
    } catch (error) {
        console.error('Error', error.message)
        res.status(error.code || 500).json({ error: error.message })
    }
}

const save = async (req, res) => {
    try {
        const { carparkId } = req.body
        const result = await carparkService.save(carparkId, req)
        res.status(200).json({ message: result })
    } catch (error) {
        console.error('Error:', error.message)
        res.status(error.code || 500).json({ error: error.message })
    }
}

const remove = async (req, res) => {
    try {
        const { carparkId } = req.body
        const result = await carparkService.remove(carparkId, req)
        res.status(200).json({ message: result })
    } catch (error) {
        console.error('Error:', error.message)
        res.status(error.code || 500).json({ error: error.message })
    }
}

module.exports = { retrieveByAddress, retrieveByAccount, save, remove }