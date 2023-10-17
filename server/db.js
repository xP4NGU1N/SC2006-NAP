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

module.exports = db