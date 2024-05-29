const mongoose = require('mongoose');

const phonebookEntrySchema = new mongoose.Schema({
  name: String,
  number: String,
});

module.exports = mongoose.model('PhonebookEntry', phonebookEntrySchema);
