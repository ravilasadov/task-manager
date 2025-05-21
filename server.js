const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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
