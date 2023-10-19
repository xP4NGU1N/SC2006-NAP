const bcrypt = require('bcrypt')
const Account = require('../entity/account')
const { ValidationError, UserExistsError, UserNotFoundError } = require('./error')

const validateSignupInput = (username, password, email) => {
    if (!username || !password || !email) return 'Empty input(s)'
    if (password.length < 8) return 'Password length < 8'
    if (!/[A-Z]/.test(password)) return 'Password does not contain an uppercase letter'
    if (!/\d/.test(password)) return 'Password does not contain a number'
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0.9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) return 'Invalid email'
    return null // No validation error
}

const validateLoginInput = (username, password) => {
    if (username == '' || password == '') return 'Empty input(s)'
    return null // No validation error
}

const signup = async (username, password, email, req) => {
    const validationError = validateSignupInput(username, password, email)
    if (validationError) {
        throw new ValidationError(validationError)
    }

    const userExists = await checkUserExists(username)
    if (userExists) {
        throw new UserExistsError()
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await Account.create({ username, password: hashedPassword, email })
    req.session.userID = newUser.id // Store id in session
    return { username: newUser.username }
}

const login = async (username, password, req) => {
    const validationError = validateLoginInput(username, password)
    if (validationError) {
        throw new ValidationError(validationError)
    }

    const User = await checkUserExists(username)
    if (!User) {
        throw new UserNotFoundError()
    }

    const hashedPassword = User.password
    const passwordMatch = await bcrypt.compare(password, hashedPassword)
    if (!passwordMatch) {
        throw new ValidationError("Incorrect password")
    }

    req.session.userID = User.id // Store id in session
    return { username: User.username }
}

const checkUserExists = async (username) => {
    const User = await Account.findOne({ where: { username } })
    return User
}

const logout = async (req) => {
    return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err)
                reject('Logout failed')
            } else {
                resolve('Logout completed')
            }
        })
    })
}

module.exports = { signup, login, logout }