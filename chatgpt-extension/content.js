// ChatGPT Brainrot Extension - Content Script
console.log('🧠 ChatGPT Brainrot extension loaded');

let lastMessageCount = 0;
let debounceTimer = null;
const DEBOUNCE_DELAY = 2000; // Wait 2 seconds after last change

// Function to trigger the brainrot
async function triggerBrainrot() {
  try {
    console.log('🚀 Triggering brainrot...');
    
    const response = await fetch('http://localhost:3000/trigger-brainrot', {
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
      console.log('✅ Brainrot activated successfully');
    } else {
      console.error('❌ Brainrot failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Failed to connect to brainrot server:', error.message);
    console.log('💡 Make sure the server is running: npm start');
  }
}

// Function to check if a message is from ChatGPT (assistant)
function isAssistantMessage(element) {
  const hasAssistantIndicator = 
    element.querySelector('[data-message-author-role="assistant"]') ||
    element.getAttribute('data-message-author-role') === 'assistant';
  
  return hasAssistantIndicator;
}

// Function to check if message generation is complete
function isMessageComplete(element) {
  const hasContent = element.textContent.trim().length > 0;
  const isGenerating = document.querySelector('[data-testid*="stop"]') !== null;
  
  return hasContent && !isGenerating;
}

// Debounced check for new completed messages
function checkForNewMessage() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = setTimeout(() => {
    const messages = document.querySelectorAll('[data-testid^="conversation-turn-"]');
    
    if (messages.length > lastMessageCount) {
      const latestMessage = messages[messages.length - 1];
      
      if (isAssistantMessage(latestMessage) && isMessageComplete(latestMessage)) {
        console.log('📝 New ChatGPT response detected');
        lastMessageCount = messages.length;
        triggerBrainrot();
      }
    }
  }, DEBOUNCE_DELAY);
}

// Set up MutationObserver to watch for changes in the chat
function observeChat() {
  const targetNode = document.body;
  
  const config = {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  };
  
  const callback = function(mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        checkForNewMessage();
        break;
      }
    }
  };
  
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  
  console.log('👀 Watching for ChatGPT responses...');
}

// Initialize when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeChat);
} else {
  observeChat();
}

// Also set initial message count
setTimeout(() => {
  const messages = document.querySelectorAll('[data-testid^="conversation-turn-"]');
  lastMessageCount = messages.length;
  console.log(`📊 Initial message count: ${lastMessageCount}`);
}, 1000);