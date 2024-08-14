const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

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

// Import and use routes
const userRoutes = require('./routes/UserRoutes');
const zipCodeRoutes = require('./routes/ZipCodeRoutes');
app.use('/api', userRoutes);
app.use('/api/zipcodes', zipCodeRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
