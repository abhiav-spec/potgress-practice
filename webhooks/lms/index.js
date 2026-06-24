const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'LMS Webhook Server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('LMS Webhook Server is running.');
});

// Example webhook endpoint
app.post('/webhook', (req, res) => {
  console.log('Received webhook event in LMS:', req.body);

  // Here you can process the webhook payload

  res.status(200).json({
    message: 'Webhook received successfully in LMS',
    receivedAt: new Date().toISOString()
  });
});

// Temp database in LMS to store registered users
const lmsUsersDb = [];

// GET users endpoint to inspect the current state of LMS's database
app.get('/api/users', (req, res) => {
  res.status(200).json({
    description: "Users registered in LMS",
    count: lmsUsersDb.length,
    users: lmsUsersDb
  });
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Missing required fields: name, email, and password are all required'
    });
  }

  // Check if user already registered in LMS
  const userExists = lmsUsersDb.some(u => u.email === email);
  if (userExists) {
    return res.status(409).json({
      message: 'User with this email is already registered'
    });
  }

  // 2. Register user locally in LMS
  const newUser = {
    name,
    email,
    registeredAt: new Date().toISOString()
  };
  lmsUsersDb.push(newUser);
  console.log(`\n👤 [LMS Registration] New user registered: ${name} (${email})`);

  // 3. Dispatch webhook to Automator Server
  let webhookDispatched = false;
  let webhookResponse = null;
  const AUTOMATOR_WEBHOOK_URL = 'http://localhost:3001/webhook';

  try {
    console.log(`📡 [LMS Webhook] Dispatching "user.registered" webhook to ${AUTOMATOR_WEBHOOK_URL}...`);
    
    const response = await fetch(AUTOMATOR_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'user.registered',
        data: {
          name: newUser.name,
          email: newUser.email
        }
      })
    });

    webhookResponse = await response.json();
    
    if (response.ok) {
      webhookDispatched = true;
      console.log('✅ [LMS Webhook] Webhook successfully acknowledged by Automator.');
    } else {
      console.error(`❌ [LMS Webhook] Webhook failed with status ${response.status}:`, webhookResponse);
    }
  } catch (error) {
    console.error('❌ [LMS Webhook] Failed to connect to Automator server:', error.message);
    webhookResponse = { error: error.message };
  }

  // 4. Respond to client
  return res.status(201).json({
    message: 'User registered successfully',
    user: newUser,
    webhook: {
      url: AUTOMATOR_WEBHOOK_URL,
      dispatched: webhookDispatched,
      response: webhookResponse
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 LMS Webhook Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`==================================================`);
});
