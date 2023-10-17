const express = require('express')
const app = express()
const port = 8080

// Middleware for parsing JSON data in request body
app.use(express.json())

const authRoutes = require('./routes/authRoute')
app.use('/auth', authRoutes)

app.get('/', (_, res) => {
    // Handle the root route (e.g., the homepage) :)
    // test
    res.send('Welcome to the homepage');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})
