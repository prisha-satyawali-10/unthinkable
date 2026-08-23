require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const summarizeRoute = require('./routes/summarize');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', summarizeRoute);

// Fallback to serve index.html for any other requests (SPA feel)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server (only if not running on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
