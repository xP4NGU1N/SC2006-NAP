const sequelize = require('../db')

const Account = sequelize.define("Account", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
})

module.exports = Account