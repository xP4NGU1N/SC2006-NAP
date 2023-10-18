const bcrypt = require("bcrypt")
const Account = require("../entities/account")

const checkUserExists = async (username) => {
    try {
        const user = await Account.findOne({where: {username: username}})
        return user
    } catch (error) {
        throw error
    }
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const signup = async (req, res) => {
    const { username, password, email } = req.body
    // validate input
    if (username == "" || password == "" || email == "") return res.status(400).json({message: "Empty input(s)"})
    if (password.length < 8) return res.status(400).json({message: "Password length < 8"})
    if (!/[A-Z]/.test(password)) return res.status(400).json({message: "Password does not contain uppercase letter"})
    if (!/\d/.test(password)) return res.status(400).json({message: "Password does not contain number"})
    if (!emailRegex.test(email)) return res.status(400).json({message: "Invalid email"})

    try {
        const userExists = await checkUserExists(username)
        if (userExists) {
            return res.status(400).json({error: "User already exists"})
        };
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({username: username, password: hashedPassword, email: email});
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
        const user = await Account.findOne({where: {username: username}})
        if (!user) {
            return res.status(400).json({error: "User not found"})
        }
        const hashedPassword = user.password
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