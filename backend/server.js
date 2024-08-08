// server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 3000; // Default port or environment port

// Middleware
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Define a basic route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
