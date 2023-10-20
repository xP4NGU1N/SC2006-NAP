const { DataTypes } = require('sequelize')
const { db } = require('../../sequelize')
const { Carpark } = require('./carpark')

const CarparkLot = db.define("CarparkLot", {
    accountId: DataTypes.STRING,
    carparkId: DataTypes.INTEGER,
    carparkLot: DataTypes.STRING,
    remarks: DataTypes.STRING
}, {tableName: "carpark_lot"})

CarparkLot.belongsTo(Carpark, { foreignKey: 'carparkId' })

module.exports = { CarparkLot }