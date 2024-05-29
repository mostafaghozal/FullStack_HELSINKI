const mongoose = require('mongoose');
const PhonebookEntry = require('./phonebookEntry');

mongoose.connect('mongodb+srv://ghozal:ghozal@cluster0.7oykssj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Function to initialize database with pre-defined values
const initializeDatabase = async () => {
  try {
    // Check if database already contains entries
    const count = await PhonebookEntry.countDocuments({});
    if (count === 0) {
      // Pre-defined values to insert
      const preDefinedValues = [
        { id: 1, name: "Arto Hellas", number: "040-123456" },
        { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
        { id: 3, name: "Dan Abramov", number: "12-43-234345" },
        { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
      ];

      // Insert pre-defined values into the database
      await PhonebookEntry.insertMany(preDefinedValues);
      console.log('Pre-defined values inserted into the database.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Export database connection and initialization function
module.exports = { db, initializeDatabase };