const { Op } = require('sequelize');
const Carpark = require("../entity/carpark")
const SavedCarpark = require("../entity/savedCarpark")

const retrieveByAddress = async (address) => {
    try {
        if (address) {
            const carparks = await Carpark.findAll({
                where: { address: {[Op.like]: `%${address}%`}}
            })
        } else {
            const carparks = await Carpark.findAll()
        }
        return(json(carparks))
    } catch (error) {
        console.error("error", error)
        res.status(500).json({error: "Database error"})
    }
}

const retrieveByAccount = async (req) => {
    const accountID = req.session.userID
    // Check if accountID stored in session
    if (!accountID) res.status(401).json({message: "Session timeout"})
    
    try {
        
    } catch (error) {
        console.error("error", error)
        res.status(500).json({error: "Database error"})
    }
}

module.exports = { retrieveByAddress, retrieveByAccount, save, remove }