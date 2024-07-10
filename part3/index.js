const express = require('express');
const cors = require('cors');
const db = require('./mongo'); // Import the MongoDB connection from db.js
const path = require('path');

const PhonebookEntry = require('./phonebookEntry'); // Assuming you've defined a model

const app = express();
app.use(cors()); // Use CORS middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public'));
});

// Error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).json({ error: 'Malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  // Default to 500 Internal Server Error for other types of errors
  res.status(500).json({ error: 'Internal server error' });
};

// Register error handling middleware
app.use(errorHandler);

// Your existing routes
app.get('/api/phonebook', async (req, res) => {
  try {
    const phonebookEntries = await PhonebookEntry.find({});
    res.json(phonebookEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/persons/:id', async (req, res) => {
  try {
    const person = await PhonebookEntry.findById(req.params.id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/info', async (req, res) => {
  try {
    const count = await PhonebookEntry.countDocuments({});
    const timestamp = new Date();
    res.send(`<p>Phonebook has info for ${count} people</p><p>${timestamp}</p>`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/phonebook', async (req, res,next) => {
  const { name, number } = req.body;
  if (name.length < 3) {
    return res.status(400).json({ error: 'Name must be at least 3 characters long' });
  }
  const phoneNumberPattern = /^([0-9]{2,3})-([0-9]{5,})$/;
  if (!phoneNumberPattern.test(number) || number.length < 8) {
    return res.status(400).json({ error: 'Number must be valid and at least 8 characters long' });
  }
  try {
    console.log(name);

    let existingPerson = await PhonebookEntry.findOne({ name });
console.log(existingPerson);
    if (existingPerson) {
      // If person exists, update the number
      existingPerson.number = number;
      const updatedPerson = await existingPerson.save();
      res.json(updatedPerson);
    } else {
      // If person doesn't exist, create a new entry
      const newEntry = new PhonebookEntry({ name, number });
      const savedEntry = await newEntry.save();
      res.json(savedEntry);
    }
  } catch (error) {
    console.error(error);
    next(error);

    // res.status(500).json({ error: 'Internal server error' });
  }
});

// app.put('/api/phonebook/:id', async (req, res) => {
//   try {
//     const updatedEntry = await PhonebookEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updatedEntry);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.put('/api/phonebook/:id', async (req, res,next) => {
  try {
    const updatedEntry = await PhonebookEntry.findByIdAndUpdate(
      req.params.id,
      { name: req.query.name, number: req.query.number },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating entry:', error);
    next(error);

    //  res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/phonebook/:id', async (req, res) => {
  try {
    await PhonebookEntry.findByIdAndDelete(req.params.id);
    res.status(204).json('Deleted Successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
