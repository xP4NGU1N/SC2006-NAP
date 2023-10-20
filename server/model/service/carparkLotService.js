const { SessionTimeoutError, ValidationError, CarparkNotFoundError, CarparkLotNotFoundError } = require('./error')
const { Carpark } = require("../entity/carpark")
const { CarparkLot } = require("../entity/carparkLot")

const retrieve = async (req) => {
    const accountId = req.session.userID
    // Check if accountID is stored in session
    if (!accountId) throw new SessionTimeoutError()

    const carparkLot = await CarparkLot.findOne({ 
        where: { accountId },
        include: [{ model: Carpark }],
    })
    if (!carparkLot) throw new CarparkLotNotFoundError("No parking lot saved")
    return carparkLot
}

const save = async (carparkId, carparkLot, remarks, req) => {
    const accountId = req.session.userID
    // Check if accountID is stored in session
    if (!accountId) throw new SessionTimeoutError()
    // Check carpark lot
    if (!carparkLot) throw new ValidationError("Carpark lot cannot be blank")
    // Check if carpark doesnt exist - shouldnt happen tho
    const carpark = await Carpark.findOne({ where: { id: carparkId } })
    if (!carpark) throw new CarparkNotFoundError("Carpark does not exist")

    // Check for existing saved lot - 1 account 1 lot
    const lot = await CarparkLot.findOne({ where: { accountId } })
    if (lot) {
        await CarparkLot.update(
            { carparkId, carparkLot, remarks}, 
            { where: { accountId } }
        )
    } else {
        await CarparkLot.create({ accountId, carparkId, carparkLot, remarks })
    }
    return lot ? "carpark lot updated" : "carpark lot added"
}

const remove = async (req) => {
    const accountId = req.session.userID
    // Check if accountID is stored in session
    if (!accountId) throw new SessionTimeoutError()

    // Check if no parking lot exists - shouldnt happen tho
    const carparkLot = await CarparkLot.findOne({ where: { accountId } })
    if (!carparkLot) throw new CarparkLotNotFoundError("No parking lot saved")
    await carparkLot.destroy()
    return "carpark removed from saved"
}

module.exports = { retrieve, save, remove }