// Load .env first
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Use Glitch's assigned port or fallback to 3000 locally
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware to parse JSON
app.use(express.json());

// ✅ Serve static frontend files
app.use(express.static('public'));

// Routes
const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Personal Task Manager API');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
