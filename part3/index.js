const express = require('express');
const db = require('./db'); // Import the MongoDB connection from db.js

// const mongoose = require('mongoose');
const PhonebookEntry = require('./phonebookEntry'); // Assuming you've defined a model

const app = express();
app.use(express.json());

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/phonebook', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((error) => console.error('Error connecting to MongoDB:', error.message));

// Route to fetch all phonebook entries
app.get('/api/phonebook', async (req, res) => {
  try {
    const phonebookEntries = await PhonebookEntry.find({});
    res.json(phonebookEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Other routes...

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
