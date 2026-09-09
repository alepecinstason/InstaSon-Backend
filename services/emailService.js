/**
 * INSTASON BACKEND
 * Serveur Node.js pour la generation de chansons
 */

const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes API
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Page d'accueil
app.get('/', (req, res) => {
  res.json({ message: 'InstaSon Backend', status: 'running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Erreur serveur' });
});

// Start server
app.listen(PORT, () => {
  console.log('InstaSon Backend demarre sur port', PORT);
});

module.exports = app;
