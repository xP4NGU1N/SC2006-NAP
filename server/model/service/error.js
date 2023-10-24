class ValidationError extends Error {
    constructor(message) {
      super(message || "Input validation error")
      this.name = 'ValidationError'
      this.code = 400
    }
}
  
class UserExistsError extends Error {
    constructor(message) {
      super(message || "User already exists")
      this.name = 'UserExistsError'
      this.code = 409
    }
}
  
class UserNotFoundError extends Error {
    constructor(message) {
      super(message || "User not found")
      this.name = 'UserNotFoundError'
      this.code = 404
    }
}

class SendEmailError extends Error {
  constructor(message) {
    super(message || "Email unable to send")
    this.name = 'SendEmailError'
    this.code = 500
  }
}

class VerificationError extends Error {
  constructor(message) {
    super(message || "Email verification code wrong")
    this.name = 'VerificationError'
    this.code = 400
  }
}

class LogoutError extends Error {
    constructor(message) {
      super(message || "Session logout error")
      this.name = 'LogoutError'
      this.code = 404
    }
}

class SessionTimeoutError extends Error {
    constructor(message) {
      super(message || "Session timeout")
      this.name = 'SessionTimeoutError'
      this.code = 440
    }
}

class CarparkNotFoundError extends Error {
    constructor(message) {
      super(message || "No carpark found")
      this.name = 'CarparkNotFoundError'
      this.code = 404
    }
}

class StatusSetError extends Error {
    constructor(message) {
      super(message || "Status already set")
      this.name = 'StatusSetError'
      this.code = 400
    }
}

class CarparkLotNotFoundError extends Error {
    constructor(message) {
      super(message || "No carpark lot found")
      this.name = 'CarparkLotNotFoundError'
      this.code = 404
    }
}

module.exports = { ValidationError, UserExistsError, UserNotFoundError, SendEmailError, VerificationError, LogoutError, SessionTimeoutError, CarparkNotFoundError, StatusSetError, CarparkLotNotFoundError };