const mongoose = require('mongoose');
const readline = require('readline');

// Connect to MongoDB Atlas
// const connectToDatabase = async (password) => {
//   const uri = `mongodb+srv://ghozal:${password}@cluster0.7oykssj.mongodb.net/?retryWrites=true&w=majority`;
//   await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// };

const connectToDatabase = async (password) => {
  try {
    if (!password) {
      throw new Error('MongoDB Atlas password not provided in environment variable');
    }
    const uri = `mongodb+srv://ghozal:${password}@cluster0.7oykssj.mongodb.net/?retryWrites=true&w=majority`;

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error.message);
    process.exit(1); // Exit process on connection failure
  }
};



// // Function to get password from user input
// const getPassword = () => {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   return new Promise((resolve) => {
//     rl.question('Enter your MongoDB Atlas password: ', (password) => {
//       resolve(password);
//       rl.close();
//     });
//   });
// };

// Add a phone number to the database




// Main function to handle command line arguments
const main = async () => {
  // Get MongoDB Atlas password from command-line arguments
  // const password = process.argv[2];

  // if (!password) {
  //   // If password is not provided as argument, get it from user input
  //   const userInputPassword = await getPassword();
  //   await connectToDatabase(userInputPassword);
  // } else {
  //   // Connect to MongoDB Atlas using the provided password
  //   await connectToDatabase(password);
  // }
  const password = "ghozal";

  await connectToDatabase(password);
  const PhonebookEntry = require('./phonebookEntry'); // Import the model after connection

  // Check if additional parameters are provided
  if (process.argv.length > 3) {
    const name = process.argv[3].replace(/-/g, ' ');
    const number = process.argv[4];
    const phonebookEntry = new PhonebookEntry({ name, number });
    await phonebookEntry.save();
    console.log(`added ${name} number ${number} to phonebook`);
  } else {
    console.log('phonebook:');
    const phonebookEntries = await PhonebookEntry.find({});
    phonebookEntries.forEach(entry => {
      console.log(`${entry.name} ${entry.number}`);
    });
  }

  // Close the MongoDB connection
};

// Call the main function
main();
