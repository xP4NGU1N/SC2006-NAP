const express = require('express')
const server = express()
const cors = require('cors')
const session = require('express-session')
const { importCarparksFromCSV } = require('./data/importCarpark')
const { db, sessionStore } = require('./sequelize')
const ngrok = require('ngrok')
const fs = require('fs')

const port = 8080

// Middleware for parsing JSON data in request body
server.use(express.json())
// Middlware to allow requests from different origins
server.use(cors( { origin: '*' }))
// Middleware for storing session details
server.use(
    session({
      secret: 'secret', // Should use env variable, but nvm
      resave: false,
      saveUninitialized: true,
      store: sessionStore
    })
)

// Define and use routes
const authRoutes = require('./routes/authRoute')
const carparkRoutes = require('./routes/carparkRoute')
const carparkLotRoutes = require('./routes/carparkLotRoute')
server.use('/auth', authRoutes)
server.use('/carpark', carparkRoutes)
server.use('/carparklot', carparkLotRoutes)

// Import sequelize models for syncing
const { Account } = require('./model/entity/account')
const { Carpark } = require('./model/entity/carpark')
const { SavedCarpark } = require('./model/entity/savedCarpark')
const { CarparkLot } = require('./model/entity/carparkLot')

// expose localhost to call APIs
async function startNgrok() {
    try {
        const url = await ngrok.connect(8080);
        console.log('Ngrok tunnel is active at:', url);
        fs.writeFileSync('./server/config.js', `module.exports = { BASE_URL: '${url}' }`)
    } catch (error) {
        console.error('Error starting Ngrok:', error);
    }
}

// Connect to database and start server
const startServer = async () => {
    await db.authenticate()
    await db.sync()
    const carparkCount = await Carpark.count()
    // Initialise carpark from CSV file for first time setup:
    // https://beta.data.gov.sg/collections/148/datasets/d_23f946fa557947f93a8043bbef41dd09/view
    // Note: carparks with same address are considered duplicate and only 1 copy is stored
    if (carparkCount == 0) await importCarparksFromCSV("./server/data/carpark_location.csv")
    await sessionStore.sync()
    console.log("Database setup and connection completed")
    startNgrok()
}

startServer()

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})