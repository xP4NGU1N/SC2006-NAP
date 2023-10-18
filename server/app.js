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

const authRoutes = require('./routes/authRoute')
app.use('/auth', authRoutes)

// test express-session on 8080/test
app.get('/test', (req, res) => {
    console.log(req.session)
    if (req.session.userID) res.status(200).json({userID: req.session.userID}) // parseInt to convert back to number
    else res.status(500).json({message: "not found"})
});

// Connect to database and start server
(async () => { 
    await db.authenticate()
    await sessionStore.sync()
    console.log("Connected to MySQL")

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}) ()
