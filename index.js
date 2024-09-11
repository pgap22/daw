const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 4000;
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read data from the JSON file
const readDataFromFile = () => {
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write data to the JSON file
const writeDataToFile = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Routes
app.all("/", (req,res)=>{
    res.json({message: "usar /api/items"})
})
// Get all items
app.get('/api/items', (req, res) => {
  const items = readDataFromFile();
  res.json(items);
});

// Get a specific item by ID
app.get('/api/items/:id', (req, res) => {
  const items = readDataFromFile();
  const item = items.find((i) => i.id === parseInt(req.params.id));
  
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Add a new item
app.post('/api/items', (req, res) => {
  const items = readDataFromFile();
  const newItem = {
    id: items.length > 0 ? items[items.length - 1].id + 1 : 1, // Increment ID
    ...req.body,
  };
  
  items.push(newItem);
  writeDataToFile(items);
  
  res.status(201).json(newItem);
});

// Update an item by ID
app.put('/api/items/:id', (req, res) => {
  const items = readDataFromFile();
  const index = items.findIndex((i) => i.id === parseInt(req.params.id));
  
  if (index !== -1) {
    items[index] = { ...items[index], ...req.body };
    writeDataToFile(items);
    res.json(items[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Delete an item by ID
app.delete('/api/items/:id', (req, res) => {
  let items = readDataFromFile();
  const index = items.findIndex((i) => i.id === parseInt(req.params.id));
  
  if (index !== -1) {
    const deletedItem = items.splice(index, 1);
    writeDataToFile(items);
    res.json(deletedItem);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
