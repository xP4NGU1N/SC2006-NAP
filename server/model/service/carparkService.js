const { Op } = require('sequelize');
const { SessionTimeoutError, CarparkNotFoundError, StatusSetError } = require('./error')
const { Carpark } = require("../entity/carpark")
const { SavedCarpark } = require("../entity/savedCarpark")

const retrieveByAddress = async (address, req) => {
    const accountId = req.session.userID
    // Check if accountID is stored in session
    if (!accountId) throw new SessionTimeoutError()
    const whereCondition = {}
    if (address) whereCondition.address = { [Op.like]: `%${address}%` }

    // Query for carparks based on the address condition
    const carparks = await Carpark.findAll({ where: whereCondition });
    if (carparks.length == 0) throw new CarparkNotFoundError(address ? "No carparks near the search request" : "No carparks in the database")

    // Create an array to store carparks with the "isSaved" property
    const carparksWithIsSaved = []
    for (const carpark of carparks) {
        // Check if the carpark is saved by the user
        const isSaved = await SavedCarpark.findOne({ where: { accountId, carparkId: carpark.id } })
        carparksWithIsSaved.push({
            ...carpark.toJSON(),
            isSaved: !!isSaved // Convert to a boolean
        })
    }
    return carparksWithIsSaved
}

const retrieveByAccount = async (req) => {
    const accountId = req.session.userID
    // Check if accountID stored in session
    if (!accountId) throw new SessionTimeoutError()
    const carparks = await SavedCarpark.findAll({
        where: { accountId },
        include: [{ model: Carpark }],
    })
    if (carparks.length == 0) throw new CarparkNotFoundError("No saved carparks")
    return carparks
}

const save = async(carparkId, req) => {
    const accountId = req.session.userID
    // Check if accountID stored in session
    if (!accountId) throw new SessionTimeoutError()

    // check if carpark exists - shouldn't be a problem though
    const carpark = await Carpark.findOne({ where: { id: carparkId } })
    if (!carpark) throw new CarparkNotFoundError("Carpark does not exist")

    const savedCarpark = await SavedCarpark.findOne({ where: { accountId, carparkId } })
    if (savedCarpark) throw new StatusSetError("Carpark already saved")
    await SavedCarpark.create({ accountId, carparkId })
    return "carpark added to saved"
}

const remove = async(carparkId, req) => {
    const accountId = req.session.userID
    // Check if accountID stored in session
    if (!accountId) throw new SessionTimeoutError()

    // check if carpark exists - shouldn't be a problem though
    const carpark = await Carpark.findOne({ where: { id: carparkId } })
    if (!carpark) throw new CarparkNotFoundError("Carpark does not exist")

    const savedCarpark = await SavedCarpark.findOne({ where: { accountId, carparkId } })
    if (!savedCarpark) throw new StatusSetError("Carpark not saved")
    await savedCarpark.destroy()
    return "carpark removed from saved"
}

module.exports = { retrieveByAddress, retrieveByAccount, save, remove }