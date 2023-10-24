const { DataTypes } = require('sequelize')
const { db } = require('../../sequelize')
const { Account } = require('./account')
const { Carpark } = require('./carpark')

const SavedCarpark = db.define("SavedCarpark", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    accountId: { type: DataTypes.INTEGER },
    carparkId: { type: DataTypes.INTEGER }
}, {tableName: "saved_carpark"})

SavedCarpark.belongsTo(Account, { foreignKey: 'accountId' });
SavedCarpark.belongsTo(Carpark, { foreignKey: 'carparkId' });

module.exports = { SavedCarpark }