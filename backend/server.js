const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const mongoUri = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : '';
console.log('Connecting to:', JSON.stringify(mongoUri));
mongoose.connect(mongoUri, { autoIndex: false })
  .then(() => {
    console.log('MongoDB Connected');
    // Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/employees', require('./routes/employeeRoutes'));
    app.use('/api/ai', require('./routes/aiRoutes'));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));


