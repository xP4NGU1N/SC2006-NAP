const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const { Account } = require('../entity/account')
const { emailPassword } = require('../../password')
const { ValidationError, UserExistsError, UserNotFoundError, SendEmailError, VerificationError, LogoutError, SessionTimeoutError } = require('./error')
//const session = require('express-session')

// Create a Nodemailer transport object
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'projectNap123@gmail.com',
      pass: emailPassword
    },
})

// helper function to send email
const sendEmail = async (email, verificationCode) => {
    try {
        const mailOptions = {
            from: 'projectNap123@gmail.com',
            to: email,
            subject: "NAP verification code to change password",
            text: `Your verification code is ${verificationCode}`
        }
        await transporter.sendMail(mailOptions)
    } catch (error) {
        throw new SendEmailError()
    }
}

function generateRandomVerificationCode() {
    const min = 100000; // Smallest 6-digit number
    const max = 999999; // Largest 6-digit number
    return Math.floor(Math.random() * (max-min+1)) + min;
}

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
    return { id: newUser.id, username: newUser.username }
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
    return { id: User.id, username: User.username }
}

const checkUserExists = async (username) => {
    const User = await Account.findOne({ where: { username } })
    return User
}

const requestNewPassword = async (username, email, newPassword, req) => {
    const validationError = validateSignupInput(username, newPassword, email)
    if (validationError) throw new ValidationError(validationError)
    const User = await Account.findOne({ where: { username, email } })
    if (!User) throw new UserNotFoundError()

    // Generate and store random code to account table, send to email
    const verificationCode = generateRandomVerificationCode()
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    req.session.userID = User.id 
    await User.update({ verificationCode, newPassword: hashedNewPassword })
    try { 
        await sendEmail(email, verificationCode)
    } catch (error) {
        throw error
    }
    return { Message: `Verification code sent to ${email}` }
}

const verifyPasswordRequestAndUpdate = async (verificationCode, req) => {
    const accountId = req.session.userID
    if (!accountId) throw new SessionTimeoutError()
    const User = await Account.findOne({ where: { id: accountId } })
    if (!User) throw new UserNotFoundError()

    if (User.verificationCode != verificationCode) throw new VerificationError()
    await User.update({ password: User.newPassword, newPassword: "" })
    req.session.userID = User.id // Store id in session
    return{ id: User.id, username: User.username }
}

const logout = async (req) => {
    try {
        await req.session.destroy()
        return 'Logout completed'
    } catch (error) {
        console.error('Error during logout:', error)
        throw new LogoutError(error.message)
    }
}

module.exports = { signup, login, logout, requestNewPassword, verifyPasswordRequestAndUpdate }