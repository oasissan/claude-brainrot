const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS for browser extension
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Brainrot server is running' });
});

// Trigger brainrot endpoint (Start)
app.post('/start-brainrot', (req, res) => {
  console.log('🧠 Starting brainrot at:', new Date().toISOString());
  
  const scriptPath = path.join(__dirname, 'manage-brainrot.ps1');
  const command = `powershell -ExecutionPolicy Bypass -File "${scriptPath}" -Action start`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error executing script:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
    console.log('✅ Brainrot windows opened');
    res.json({ success: true, message: 'Brainrot started!' });
  });
});

// Stop brainrot endpoint
app.post('/stop-brainrot', (req, res) => {
  console.log('🛑 Stopping brainrot at:', new Date().toISOString());
  
  const scriptPath = path.join(__dirname, 'manage-brainrot.ps1');
  const command = `powershell -ExecutionPolicy Bypass -File "${scriptPath}" -Action stop`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error executing script:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
    console.log('✅ Brainrot windows closed');
    res.json({ success: true, message: 'Brainrot stopped!' });
  });
});

// Legacy endpoint support
app.post('/trigger-brainrot', (req, res) => {
  // Redirect to start
  res.redirect(307, '/start-brainrot');
});

app.listen(PORT, () => {
  console.log(`🚀 Brainrot server running on http://localhost:${PORT}`);
  console.log(`📡 Waiting for ChatGPT responses...`);
});