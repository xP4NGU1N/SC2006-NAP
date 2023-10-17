const express = require('express')
const app = express()
const db = require('./db')
const port = 8080

// Middleware for parsing JSON data in request body
app.use(express.json())

const authRoutes = require('./routes/authRoute')
app.use('/auth', authRoutes)

app.get('/', (_, res) => {
    // Test localhost:8080
    res.send('Welcome to the homepage');
});

// Connect to database and start server
(async () => { 
    await db.promise().connect()
    console.log("Connected to MySQL")

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}) ()
