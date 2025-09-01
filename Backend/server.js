const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Use express's built-in JSON parser
app.use(bodyParser.urlencoded({ extended: true })); // For form data, if needed

// MongoDB Connection
// WARNING: It's recommended to use environment variables for database credentials.
// Example: mongoose.connect(process.env.MONGO_URI)
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const mongoDb = process.env.MONGO_DB || 'peopleDB';

mongoose.connect(mongoUri, { dbName: mongoDb })
    .then(() => console.log(`MongoDB Connected (db: ${mongoDb})`))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// API Routes
const personRoutes = require('./routes/person');
app.use('/api/person', personRoutes);

// Health endpoint to verify DB connectivity
app.get('/api/health', (req, res) => {
    const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    const conn = mongoose.connection;
    res.json({
        status: stateMap[conn.readyState] || conn.readyState,
        dbName: conn.name,
        host: conn.host,
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('People Management API is running...');
});

// Start Server
app.listen(port, () => {
    console.log(`API Server is running on http://localhost:${port}`);
});
