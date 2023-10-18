const bcrypt = require("bcrypt")
const Account = require("../model/account")

const checkUserExists = async (username) => {
    try {
        console.log(Account)
        const User = await Account.findOne({where: {username: username}})
        return User
    } catch (error) {
        throw error
    }
}

const signup = async (req, res) => {
    const { username, password, email } = req.body
    // validate input
    if (!username || !password || !email) return res.status(400).json({message: "Empty input(s)"})
    if (password.length < 8) return res.status(400).json({message: "Password length < 8"})
    if (!/[A-Z]/.test(password)) return res.status(400).json({message: "Password does not contain uppercase letter"})
    if (!/\d/.test(password)) return res.status(400).json({message: "Password does not contain number"})
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) return res.status(400).json({message: "Invalid email"})

    try {
        const userExists = await checkUserExists(username)
        if (userExists) {
            return res.status(400).json({error: "User already exists"})
        };
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await Account.create({username: username, password: hashedPassword, email: email});
        req.session.userID = newUser.id // store id in session
        res.status(201).json({username}) // return username to front-end
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
        const User = await Account.findOne({where: {username: username}})
        if (!User) {
            return res.status(400).json({error: "User not found"})
        }
        const hashedPassword = User.password
        const passwordMatch = await bcrypt.compare(password, hashedPassword)
        if (!passwordMatch) {
            return res.status(401).json({error: "Incorrect password"})
        }
        req.session.userID = User.id // store id in session
        res.status(200).json({username}) // return username to front-end
    } catch (err) {
        console.error("Error", err)
        res.status(500).json({error: "Database error"})
    }
}

const logout = async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({message: 'Logout failed'});
      } else res.status(200).json({message: "Logout completed"})
    })
}

module.exports = { signup, login, logout }