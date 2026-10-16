/**
 * APPLICATION CONFIGURATION
 * Stores API keys, model parameters, and default settings.
 * 
 * Paste your Gemini API key below, or configure it securely in the UI
 * under Backup & Settings -> Gemini AI API Configuration.
 */

const APP_CONFIG = {
  // Enter your Gemini API Key here (or configure via UI settings)
  GEMINI_API_KEY: '',
  
  // Available models with automatic fallback
  GEMINI_MODELS: [
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest'
  ],
  
  // API Endpoint
  API_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',

  // Local storage override key (allows user to update or customize key via UI settings)
  STORAGE_KEY_API: 'opportunity_agent_custom_api_key'
};

// Helper function to resolve active API Key (checks localStorage override first, falls back to config)
function getActiveApiKey() {
  const customKey = localStorage.getItem(APP_CONFIG.STORAGE_KEY_API);
  return (customKey && customKey.trim()) ? customKey.trim() : APP_CONFIG.GEMINI_API_KEY;
}

// Helper to mask key for safe display (e.g., AIzaSyD...rfgTw)
function maskApiKey(key) {
  if (!key || key.length < 10) return '••••••••••••';
  return key.slice(0, 8) + '••••••••••••' + key.slice(-5);
}
