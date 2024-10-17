// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // To parse JSON bodies

// In-memory "database" to store history (for simplicity)
let calculationHistory = [];

// Endpoint to log the calculation
app.post('/log', (req, res) => {
  const { calculation } = req.body;
  if (calculation) {
    calculationHistory.push(calculation);
    res.status(201).send({ message: 'Calculation logged' });
  } else {
    res.status(400).send({ message: 'No calculation provided' });
  }
});

// Endpoint to get the calculation history
app.get('/history', (req, res) => {
  res.status(200).send(calculationHistory);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});