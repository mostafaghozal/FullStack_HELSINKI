// routes/users.js
const express = require('express')
const User = require('../models/user')
const router = express.Router()

// Create a new user
router.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }

  if (password.length < 3) {
    return res.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({ error: 'username already exists' })
  }

  const user = new User({
    username,
    name,
  })
  user.setPassword(password)

  try {
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(500).json({ error: 'internal server error' })
  }
})

// Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'internal server error' })
  }
})

module.exports = router
