const bcrypt = require("bcrypt")
const db = require("../db")

const checkUserExists = async (username) => {
    try {
        const [results] = await db.promise().query("SELECT * FROM account WHERE username = ?", [username])
        return results.length > 0
    } catch (error) {
        throw error
    }
}

const signup = async (req, res) => {
    const { username, password } = req.body
    // validate input
    if (username == "" || password == "") return res.status(400).json({message: "Empty input(s)"})
    if (password.length < 8) return res.status(400).json({message: "Password length < 8"})
    if (!/[A-Z]/.test(password)) return res.status(400).json({message: "Password does not contain uppercase letter"})
    if (!/\d/.test(password)) return res.status(400).json({message: "Password does not contain number"})

    try {
        const userExists = await checkUserExists(username)
        if (userExists) {
            return res.status(400).json({error: "User already exists"})
        };
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.promise().query("INSERT INTO account (username, password) VALUES (?, ?)", [username, hashedPassword])
        res.status(201).json({message: "User registered successfully"})
    } catch (error) {
        console.error("error", error)
        res.status(500).json({error: error})
    }
}

const login = async (req, res) => {
    const { username, password } = req.body
    // validate input
    if (username == "" || password == "") return res.status(400).json({message: "Empty input(s)"})

    try {
        const [results] = await db.promise().query("SELECT * FROM account WHERE username = ?", [username])
        if (results.length == 0) {
            return res.status(400).json({error: "User not found"})
        }
        const hashedPassword = results[0]["password"]
        const passwordMatch = await bcrypt.compare(password, hashedPassword)
        if (!passwordMatch) {
            return res.status(401).json({error: "Incorrect password"})
        }
        res.status(200).json({message: "Login successful"})
    } catch (err) {
        console.error("Error", err)
        res.status(500).json({error: "Database error"})
    }
}

module.exports = { signup, login }