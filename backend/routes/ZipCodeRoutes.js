const express = require('express');
const ZipCode = require('../models/ZipCode');
const router = express.Router();

// Middleware to validate the zip code and coordinates
const validateZipCode = (req, res, next) => {
  const { zip, coords } = req.body;

  if (!zip || !coords) {
    return res.status(400).json({ error: 'Zip code and coordinates are required' });
  }

  // Basic validation: Check length of zip code and coordinates format if needed
  if (zip.length !== 5 || !/^\d{5}$/.test(zip)) {
    return res.status(400).json({ error: 'Invalid zip code format. Must be a 5-digit number.' });
  }

  // You can add more complex validation for coordinates if needed
  next();
};

// Create a new zip code entry
router.post('/coords', validateZipCode, async (req, res) => {
  try {
    const { zip, coords } = req.body;

    // Check if the zip code already exists
    const existingZipCode = await ZipCode.findOneAndUpdate(
      { zip },
      { coords },
      { new: true, upsert: true } // Update if exists, or insert if not
    );

    res.status(201).json({
      message: 'Zip code saved successfully',
      zip: existingZipCode.zip,
      coords: existingZipCode.coords
    });
  } catch (error) {
    console.error('Error saving zip code:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});


// Get coordinates by zip code
router.get('/coords/:zip', async (req, res) => {
  try {
    const zip = req.params.zip;

    // Find the zip code in the database
    const zipCodeEntry = await ZipCode.findOne({ zip });

    if (!zipCodeEntry) {
      return res.status(404).json({ error: 'Zip code not found' });
    }

    // Return coordinates
    res.status(200).json({
      zip: zipCodeEntry.zip,
      coords: zipCodeEntry.coords
    });
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

module.exports = router;
