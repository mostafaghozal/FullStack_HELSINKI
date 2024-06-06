const mongoose = require('mongoose');
const readline = require('readline');

// Connect to MongoDB Atlas
const connectToDatabase = async (password) => {
  const uri = `mongodb+srv://ghozal:${password}@cluster0.7oykssj.mongodb.net/?retryWrites=true&w=majority`;
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

// Function to get password from user input
const getPassword = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Enter your MongoDB Atlas password: ', (password) => {
      resolve(password);
      rl.close();
    });
  });
};

// Add a phone number to the database
const addPhoneNumber = async (name, number) => {
  const PhonebookEntry = mongoose.model('PhonebookEntry', new mongoose.Schema({
    name: String,
    number: String,
  }));
  const phonebookEntry = new PhonebookEntry({ name, number });
  await phonebookEntry.save();
};

// List all phone numbers in the database
const listPhoneNumbers = async () => {
  const PhonebookEntry = mongoose.model('PhonebookEntry', new mongoose.Schema({
    name: String,
    number: String,
  }));
  const phonebookEntries = await PhonebookEntry.find({});
  return phonebookEntries;
};

// Main function to handle command line arguments
const main = async () => {
  // Get MongoDB Atlas password from command-line arguments
  const password = process.argv[2];

  if (!password) {
    // If password is not provided as argument, get it from user input
    const userInputPassword = await getPassword();
    await connectToDatabase(userInputPassword);
  } else {
    // Connect to MongoDB Atlas using the provided password
    await connectToDatabase(password);
  }

  // Check if additional parameters are provided
  if (process.argv.length > 3) {
    // Add new phone number to the database
    const name = process.argv[3].replace(/-/g, ' ');
    const number = process.argv[4];
    await addPhoneNumber(name, number);
    console.log(`added ${name} number ${number} to phonebook`);
  } else {
    // List all phone numbers in the database
    console.log('phonebook:');
    const phonebookEntries = await listPhoneNumbers();
    phonebookEntries.forEach(entry => {
      console.log(`${entry.name} ${entry.number}`);
    });
  }

  // Close the MongoDB connection
  mongoose.connection.close();
};

// Call the main function
main();
