const { DataTypes } = require('sequelize')
const { db } = require('../../sequelize')

// https://beta.data.gov.sg/collections/148/datasets/d_23f946fa557947f93a8043bbef41dd09/view
const Account = db.define("Carpark", {
    carpark_no: DataTypes.STRING,
    address: DataTypes.STRING,
    x_coord: DataTypes.STRING,
    y_coord: DataTypes.STRING,
    carpark_type: DataTypes.STRING,
    payment_system: DataTypes.STRING
}, {tableName: "carpark"})

module.exports = Account