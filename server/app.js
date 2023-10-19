const express = require('express')
const app = express()
const session = require('express-session');
const { db, sessionStore } = require('./sequelize')

const port = 8080

// Middleware for parsing JSON data in request body
app.use(express.json())

// Middleware for storing session details
app.use(
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
app.use('/auth', authRoutes)
app.use('/carpark', carparkRoutes)
app.use('/carparklot', carparkLotRoutes)

// Connect to database and start server
const startServer = async () => {
    await db.authenticate()
    await sessionStore.sync()
    console.log("Connected to MySQL")

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

startServer()