const mysql = require('mysql2')

// Set up DB
const db = mysql.createConnection({
    host: "localhost", // Your MySQL server host
    user: "root", // Your MySQL username
    password: "password", // Your MySQL password
    database: "nap", // Your database name
    port: 3306,
    connectionLimit: 10,
})

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL", err)
        return
    }
    console.log("Connected to MySQL server")
})

module.exports = db