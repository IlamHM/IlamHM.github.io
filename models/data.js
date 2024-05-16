const mongoose = require('mongoose');

// Define a schema
const dataSchema = new mongoose.Schema({
  nama: String,
  link: String
});

// Create a model
const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
