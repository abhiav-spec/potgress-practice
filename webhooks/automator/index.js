const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); // Added for secure random string generation

const app = express();
const PORT = process.env.PORT || 3001;

// Temp database
const db = {};

// Helper function to generate secret keys
const generateRandomString = (length) => {
  return crypto.randomBytes(length / 2).toString('hex');
};

// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'Automator Webhook Server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Automator Webhook Server is running.');
});

// GET users endpoint to inspect the current state of Automator's database
app.get('/users', (req, res) => {
  res.status(200).json({
    description: "Users synced via webhook from LMS or registered locally",
    count: Object.keys(db).length,
    users: db
  });
});

// Example webhook endpoint
app.post('/webhook', (req, res) => {
  console.log('Received webhook event in Automator:', req.body);
  
  const { event, data } = req.body;
  if (event === 'user.registered' && data) {
    const { name, email } = data;
    if (email && name) {
      db[email] = {
        name,
        email,
        syncedAt: new Date().toISOString(),
        source: 'webhook'
      };
      console.log(`✅ User synced to temp database via webhook: ${name} (${email})`);
    }
  }

  res.status(200).json({
    message: 'Webhook received successfully in Automator',
    receivedAt: new Date().toISOString()
  });
});

// FIXED: Cleaned up the try/catch and removed duplicate blocks
app.post('/register-webhook', (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!email || !name) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  if (db[email]) {
    return res.status(400).json({
      message: 'Webhook already registered'
    });
  }

  try {
    const secret = generateRandomString(32);
    
    // Storing data into memory with email as the ID key
    db[email] = {
      name,
      secret,
      createdAt: new Date(),
    };

    console.log('Webhook registered for user:', name, email);
    
    return res.status(200).json({
      message: 'Webhook registered successfully',
      webhookURL: `http://localhost:${PORT}/webhooks/${email}`,
      secret
    });

  } catch (error) {
    console.error('Error registering webhook:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Automator Webhook Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`==================================================`);
});
