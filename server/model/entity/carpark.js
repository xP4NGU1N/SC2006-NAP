const { DataTypes } = require('sequelize')
const { db } = require('../../sequelize')

const Carpark = db.define("Carpark", {
    carparkNo: DataTypes.STRING,
    address: DataTypes.STRING,
    xCoord: DataTypes.STRING,
    yCoord: DataTypes.STRING,
    carparkType: DataTypes.STRING,
    paymentSystem: DataTypes.STRING
}, {tableName: "carpark"})

module.exports = { Carpark }