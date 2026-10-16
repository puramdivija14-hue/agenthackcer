/**
 * APPLICATION CONFIGURATION
 * Stores API keys, backend URL, model parameters, and storage keys.
 * 
 * DEPLOYMENT ARCHITECTURE:
 * - Frontend: Deployed on Vercel (static web app)
 * - Backend: Deployed on Render (Node.js/Express API service)
 */

const APP_CONFIG = {
  // Render Backend URL (Leave empty to use client-side or enter your deployed Render URL)
  // Example: 'https://opportunity-radar-backend.onrender.com'
  BACKEND_URL: '',

  // Optional direct Gemini API Key for standalone / client-side operation
  // When Render Backend is connected, the API key stays secured on the Render server!
  GEMINI_API_KEY: '',
  
  // Fallback Gemini models
  GEMINI_MODELS: [
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-flash-latest'
  ],
  
  // Direct Google Generative Language API Endpoint
  API_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',

  // LocalStorage keys for settings persistence
  STORAGE_KEY_API: 'opportunity_agent_custom_api_key',
  STORAGE_KEY_BACKEND: 'opportunity_agent_backend_url'
};

// Helper function to resolve active Render Backend URL
function getActiveBackendUrl() {
  const customBackend = localStorage.getItem(APP_CONFIG.STORAGE_KEY_BACKEND);
  const url = (customBackend && customBackend.trim()) ? customBackend.trim() : APP_CONFIG.BACKEND_URL;
  return url ? url.replace(/\/+$/, '') : ''; // Remove trailing slashes
}

// Helper function to resolve active client-side API Key (if backend is not used)
function getActiveApiKey() {
  const customKey = localStorage.getItem(APP_CONFIG.STORAGE_KEY_API);
  return (customKey && customKey.trim()) ? customKey.trim() : APP_CONFIG.GEMINI_API_KEY;
}

// Helper to mask key for safe display (e.g., AIzaSyD...rfgTw)
function maskApiKey(key) {
  if (!key || key.length < 10) return '••••••••••••';
  return key.slice(0, 8) + '••••••••••••' + key.slice(-5);
}
