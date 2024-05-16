const express = require('express');
const mongoose = require('mongoose');
const JasaMarga = require('./models/data'); // Import the Mongoose model
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cctv_padaleunyi', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Handle connection events
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json());

// Endpoint to add new data (create operation)
app.post('/api/addData', async (req, res) => {
  const { nama, link } = req.body;

  try {
    // Create a new JasaMarga document using the provided data
    const newData = await JasaMarga.create({ nama, link });
    res.json(newData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to fetch all data (read operation)
app.get('/api/getData', async (req, res) => {
  try {
    // Retrieve all JasaMarga documents from the MongoDB collection
    const allData = await JasaMarga.find();
    res.json(allData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve the index.html file (optional)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
