const express = require('express');
const { get } = require('@vercel/edge-config'); // Import 'get' function from @vercel/edge-config
const app = express();
const port = 3000;

// Data temporary storage (will be reset on server restart)
let data = {};

// Middleware to fetch configuration from Vercel Edge Config
app.use(async (req, res, next) => {
  try {
    // Get configuration values from Vercel Edge Config
    const editId = await get('editId');
    const deleteId = await get('deleteId');

    req.editId = editId; // Store editId in request object for use in endpoints
    req.deleteId = deleteId; // Store deleteId in request object for use in endpoints

    next();
  } catch (error) {
    console.error('Error fetching configuration from Vercel Edge Config:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to add new data (create operation)
app.post('/api/addData', (req, res) => {
  const { id, nama, link } = req.body;

  // Add new data to temporary storage
  data[id] = { nama, link };

  res.json({ message: 'Data added successfully', data: data[id] });
});

// Endpoint to edit data
app.put('/api/editData/:id', (req, res) => {
  const { id } = req.params;
  const { nama, link } = req.body;

  // Check if the provided ID matches the editId from Vercel Edge Config
  if (id !== req.editId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Update data in temporary storage
  if (data[id]) {
    data[id] = { nama, link };
    res.json({ message: 'Data updated successfully', data: data[id] });
  } else {
    res.status(404).json({ message: 'Data not found' });
  }
});

// Endpoint to delete data
app.delete('/api/deleteData/:id', (req, res) => {
  const { id } = req.params;

  // Check if the provided ID matches the deleteId from Vercel Edge Config
  if (id !== req.deleteId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Delete data from temporary storage
  if (data[id]) {
    delete data[id];
    res.json({ message: 'Data deleted successfully' });
  } else {
    res.status(404).json({ message: 'Data not found' });
  }
});

// Endpoint to fetch all data (read operation)
app.get('/api/getData', (req, res) => {
  res.json(data);
});

// Serve the index.html file (optional)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
