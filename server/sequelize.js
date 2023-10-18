const { Sequelize } = require('sequelize')

// Set up DB
const db = new Sequelize('nap', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql', 
})

const session = require('express-session')
const sequelizeStore = require('connect-session-sequelize')(session.Store)

const sessionStore = new sequelizeStore({
    db: db,
    tableName: "session"
})

module.exports = { db, sessionStore }