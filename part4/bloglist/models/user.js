const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: {
    type: String,
    required: true
  }
})

userSchema.plugin(uniqueValidator)

// Method to set the password hash
userSchema.methods.setPassword = function(password) {
  const saltRounds = 10
  this.passwordHash = bcrypt.hashSync(password, saltRounds)
}

// Method to validate password
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash)
}

const User = mongoose.model('User', userSchema)

module.exports = User