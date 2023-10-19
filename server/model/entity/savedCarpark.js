const { DataTypes, Model } = require('sequelize')
const { db } = require('../../sequelize')

class SavedCarpark extends Model {}

SavedCarpark.init({
    accountID: { type: DataTypes.INTEGER },
    carparkID: { type: DataTypes.INTEGER }
}, { db, modelName: "savedCarpark" })

module.exports = SavedCarpark