const { Sequelize } = require('sequelize')

// Set up DB
const sequelize = new Sequelize('nap', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql', 
})

module.exports = sequelize