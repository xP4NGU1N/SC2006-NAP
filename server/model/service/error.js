class ValidationError extends Error {
    constructor(message) {
      super(message || "Input validation error")
      this.name = 'ValidationError'
      this.code = 400
    }
}
  
class UserExistsError extends Error {
    constructor(message) {
      super(message || "User already exists");
      this.name = 'UserExistsError';
      this.code = 409
    }
}
  
class UserNotFoundError extends Error {
    constructor(message) {
      super(message || "User not found");
      this.name = 'UserNotFoundError';
      this.code = 404
    }
}
  
module.exports = { ValidationError, UserExistsError, UserNotFoundError };