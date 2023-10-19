const { DataTypes } = require('sequelize')
const { db } = require('../../sequelize')

// https://beta.data.gov.sg/collections/148/datasets/d_23f946fa557947f93a8043bbef41dd09/view
const Carpark = db.define("Carpark", {
    carparkNo: DataTypes.STRING,
    address: DataTypes.STRING,
    xCoord: DataTypes.STRING,
    yCoord: DataTypes.STRING,
    carparkType: DataTypes.STRING,
    paymentSystem: DataTypes.STRING
}, {tableName: "carpark"})

module.exports = { Carpark }