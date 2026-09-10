/**
 * INSTASON BACKEND
 * Serveur Node.js pour la generation de chansons
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes API
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Page d'accueil
app.get('/', (req, res) => {
  res.json({ 
    message: 'InstaSon Backend', 
    status: 'running',
    version: '1.0.0'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Erreur serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('========================================');
  console.log('  INSTASON BACKEND DEMARRE');
  console.log('  Port:', PORT);
  console.log('  Mode:', process.env.NODE_ENV || 'development');
  console.log('========================================');
});

module.exports = app;
