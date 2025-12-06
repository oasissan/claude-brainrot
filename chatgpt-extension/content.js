// ChatGPT Brainrot Extension - Content Script
console.log('🧠 ChatGPT Brainrot extension loaded');

let isBrainrotActive = false;
let checkInterval = null;

// Function to call server endpoints
async function callServer(endpoint) {
  try {
    console.log(`🚀 Calling ${endpoint}...`);
    
    const response = await fetch(`http://localhost:3000/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        timestamp: new Date().toISOString(),
        source: 'chatgpt'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ ${endpoint} successful`);
    } else {
      console.error(`❌ ${endpoint} failed:`, data.error);
    }
  } catch (error) {
    console.error(`❌ Failed to connect to brainrot server (${endpoint}):`, error.message);
    console.log('💡 Make sure the server is running: npm start');
  }
}

function checkGenerationStatus() {
  // Multiple ways to detect generation in progress
  const stopButton = document.querySelector('button[aria-label*="Stop"]') || 
                     document.querySelector('[data-testid="stop-button"]') ||
                     document.querySelector('button[class*="stop"]');
  
  // Also check for streaming indicator or regenerate button absence
  const isGenerating = stopButton !== null;
  
  if (isGenerating && !isBrainrotActive) {
    console.log('🔄 Generation started - Activating Brainrot');
    isBrainrotActive = true;
    callServer('start-brainrot');
  } else if (!isGenerating && isBrainrotActive) {
    console.log('✅ Generation finished - Stopping Brainrot');
    isBrainrotActive = false;
    callServer('stop-brainrot');
  }
}

// Set up MutationObserver to watch for changes in the chat
function observeChat() {
  const targetNode = document.body;
  
  const config = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-label', 'class', 'data-testid'],
    characterData: false
  };
  
  const callback = function(mutationsList, observer) {
    checkGenerationStatus();
  };
  
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  
  console.log('👀 Watching for ChatGPT generation status...');
  
  // Check every 500ms for more responsive detection
  if (checkInterval) clearInterval(checkInterval);
  checkInterval = setInterval(checkGenerationStatus, 500);
}

// Initialize when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeChat);
} else {
  observeChat();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (checkInterval) clearInterval(checkInterval);
  if (isBrainrotActive) {
    callServer('stop-brainrot');
  }
});