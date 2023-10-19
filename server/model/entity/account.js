const { DataTypes } = require('sequelize')
const { db } = require('../../sequelize')

const Account = db.define("Account", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
}, {tableName: "account"})

module.exports = Account