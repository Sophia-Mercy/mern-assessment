const express = require('express');
const roomRoutes = require('./routes/roomRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Hotel Room Inventory API is running',
    port: 8080,
    endpoints: '/api/rooms'
  });
});

// Routes
app.use('/api/rooms', roomRoutes);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;