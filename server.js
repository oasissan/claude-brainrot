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

// Trigger brainrot endpoint
app.post('/trigger-brainrot', (req, res) => {
  console.log('🧠 Brainrot triggered at:', new Date().toISOString());
  
  const scriptPath = path.join(__dirname, 'open-brainrot.sh');
  
  exec(`bash "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error executing script:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
    
    if (stderr) {
      console.warn('⚠️ Script stderr:', stderr);
    }
    
    if (stdout) {
      console.log('📝 Script output:', stdout);
    }
    
    console.log('✅ Brainrot windows opened successfully');
    res.json({ success: true, message: 'Brainrot activated!' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Brainrot server running on http://localhost:${PORT}`);
  console.log(`📡 Waiting for ChatGPT responses...`);
});