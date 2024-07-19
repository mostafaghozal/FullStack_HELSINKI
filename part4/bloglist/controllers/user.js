const User = require('../models/user');

const createUser = async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || password.length < 3 || username.length < 3) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const user = new User({ username, password, name });
  await user.save();
  res.status(201).json(user);
};

const getAllUsers = async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 });
  res.json(users);
};

module.exports = { createUser, getAllUsers };
