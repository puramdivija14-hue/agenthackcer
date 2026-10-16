/**
 * OPPORTUNITY RADAR BACKEND SERVICE
 * Designed for deployment on Render (or local Node.js server)
 * 
 * Proxies Google Gemini API calls, secures API keys on the server,
 * and provides RESTful endpoints for the Opportunity Reminder Agent.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// CORS & Middleware Configuration
// ============================================================================
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) 
  : '*';

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins === '*' || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow vercel preview deployments
    if (origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '2mb' }));

// Request logger for Render logs
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ============================================================================
// Gemini Helper Functions (Multi-Model Resilient Calling)
// ============================================================================
const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-flash-latest'
];

async function callGemini(promptText, customKey = null) {
  const apiKey = (customKey && customKey.trim()) ? customKey.trim() : process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('No Gemini API key configured on the server. Please set the GEMINI_API_KEY environment variable in your Render dashboard.');
  }

  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const msg = errJson.error?.message || `HTTP ${response.status}`;
        if (response.status === 503 || response.status === 404) {
          lastError = new Error(`[${model}] ${msg}`);
          continue; // Try next fallback model
        }
        throw new Error(`Gemini API Error: ${msg}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return { text, modelUsed: model };
      } else {
        throw new Error('Gemini returned an empty response.');
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All candidate Gemini models failed to respond.');
}

// ============================================================================
// API Routes
// ============================================================================

// 1. Root & Health Check Endpoint
app.get(['/', '/health', '/api/health'], (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Opportunity Radar Backend API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    allowedOrigins: allowedOrigins === '*' ? 'all (*)' : allowedOrigins,
    version: '1.0.0'
  });
});

// 2. Generic Gemini Prompt Endpoint (Used for latency testing & direct queries)
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, customApiKey } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing required field: prompt' });
    }

    const result = await callGemini(prompt, customApiKey);
    res.json(result);
  } catch (err) {
    console.error('Error in /api/gemini/generate:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. Radar Copilot Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], context = {}, customApiKey } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Missing message in request body' });
    }

    const todayIST = context.todayIST || new Date().toISOString().split('T')[0];
    const urgentCount = context.urgentCount || 0;
    const pendingTasksCount = context.pendingTasksCount || 0;
    const opportunitiesSummary = context.opportunitiesSummary || 'None currently active.';
    const remindersSummary = context.remindersSummary || 'None currently active.';

    const systemPrompt = `You are "Radar Copilot", an elite, proactive, and friendly college academic & career assistant for an engineering/tech student in India.
Current Date in Indian Standard Time (IST): ${todayIST}.

STUDENT'S LIVE STATUS:
- Closing-Soon Opportunities (next 7 days): ${urgentCount}
- Pending Reminders & Academic Tasks: ${pendingTasksCount}

CURRENT OPPORTUNITY RADAR:
${opportunitiesSummary}

CURRENT PENDING TASKS & DEADLINES:
${remindersSummary}

INSTRUCTIONS:
1. Answer the student's question accurately, concisely, and encouragingly. Use formatting like bullet points and bold text.
2. If the student asks you to add, log, or track a task, milestone, or assignment:
   Include this EXACT machine-readable command block at the end of your response:
   <<<ACTION_COMMAND: {"action":"add_reminder","title":"<Title>","category":"<Assignment|Exam|Project|LeetCode|Other>","priority":"<High|Medium|Low>","dueDate":"<YYYY-MM-DD>","dueTime":"23:59","description":"<Brief details>"}>>>
3. If the student asks to track an opportunity, competition, or hackathon:
   Include this EXACT machine-readable command block at the end of your response:
   <<<ACTION_COMMAND: {"action":"add_opportunity","title":"<Title>","category":"<Hackathon|Certification|Internship|Scholarship|Course>","url":"<URL or https://unstop.com>","deadline":"<YYYY-MM-DD>","cost":"Free","notes":"<Notes>"}>>>
4. If asked about recommendations or prep roadmaps, provide practical, actionable advice.

CONVERSATION HISTORY:
${history.slice(-4).map(h => `${h.role === 'user' ? 'Student' : 'Copilot'}: ${h.text}`).join('\n')}

Student's Latest Message: "${message}"

Your Response (as Radar Copilot):`;

    const result = await callGemini(systemPrompt, customApiKey);

    // Extract any action command if present
    let action = null;
    const actionMatch = result.text.match(/<<<ACTION_COMMAND:\s*(\{.*?\})\s*>>>/);
    if (actionMatch) {
      try {
        action = JSON.parse(actionMatch[1]);
      } catch (e) {
        console.warn('Failed to parse action JSON:', e.message);
      }
    }

    res.json({
      text: result.text,
      action: action,
      modelUsed: result.modelUsed
    });
  } catch (err) {
    console.error('Error in /api/chat:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 4. AI Announcement Extractor Endpoint
app.post('/api/gemini/extract', async (req, res) => {
  try {
    const { text, customApiKey } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Missing text in request body' });
    }

    const prompt = `You are a structured data extractor for college students.
Extract the opportunity details from the following announcement text.
Return ONLY valid JSON in this exact structure with no surrounding markdown ticks:
{
  "title": "Concise opportunity name",
  "category": "Hackathon" | "Certification" | "Internship" | "Scholarship" | "Course" | "Workshop",
  "url": "Official portal URL or best guess URL",
  "deadline": "YYYY-MM-DD (estimate reasonable future date if unspecified)",
  "eligibility": "Eligibility criteria",
  "cost": "Free" or "Paid / Voucher",
  "notes": "Short summary of prizes, rounds, or perks"
}

Announcement Text:
"""
${text}
"""`;

    const result = await callGemini(prompt, customApiKey);
    let parsedData = null;
    try {
      const cleaned = result.text.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    } catch (e) {
      return res.json({ text: result.text, raw: true });
    }

    res.json({ data: parsedData, modelUsed: result.modelUsed });
  } catch (err) {
    console.error('Error in /api/gemini/extract:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 5. Tailored Recommendations Endpoint
app.post('/api/gemini/recommend', async (req, res) => {
  try {
    const { year, interests, customApiKey } = req.body;
    const prompt = `Recommend 3 realistic, high-value opportunities (hackathons, cloud certifications, or internships) for a ${year || 'college'} engineering student interested in ${interests || 'tech and coding'}.
Return ONLY a valid JSON array of 3 objects in this exact structure with no surrounding markdown ticks:
[
  {
    "title": "Title of Program",
    "category": "Hackathon" | "Certification" | "Internship",
    "url": "https://...",
    "deadlineDaysFromNow": 14,
    "eligibility": "Target criteria",
    "cost": "Free",
    "notes": "Why this is recommended for their profile"
  }
]`;

    const result = await callGemini(prompt, customApiKey);
    let items = [];
    try {
      const cleaned = result.text.replace(/```json/gi, '').replace(/```/g, '').trim();
      items = JSON.parse(cleaned);
    } catch (e) {
      return res.json({ text: result.text, raw: true });
    }

    res.json({ recommendations: items, modelUsed: result.modelUsed });
  } catch (err) {
    console.error('Error in /api/gemini/recommend:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 6. Exam / Milestone Study Breakdown Endpoint
app.post('/api/gemini/milestones', async (req, res) => {
  try {
    const { title, examDate, customApiKey } = req.body;
    const prompt = `Create a 4-step preparation milestone checklist for an engineering student preparing for: "${title}" with target exam/deadline date "${examDate || 'in 14 days'}".
Return ONLY a valid JSON array of 4 objects in this exact structure with no surrounding markdown ticks:
[
  {
    "title": "Milestone description",
    "daysBeforeExam": 7,
    "priority": "High" | "Medium",
    "description": "Specific study objective"
  }
]`;

    const result = await callGemini(prompt, customApiKey);
    let steps = [];
    try {
      const cleaned = result.text.replace(/```json/gi, '').replace(/```/g, '').trim();
      steps = JSON.parse(cleaned);
    } catch (e) {
      return res.json({ text: result.text, raw: true });
    }

    res.json({ milestones: steps, modelUsed: result.modelUsed });
  } catch (err) {
    console.error('Error in /api/gemini/milestones:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}. See /health for API overview.` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Opportunity Radar Backend running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔑 Gemini Configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
  console.log(`🌐 Allowed CORS: ${allowedOrigins === '*' ? 'All (*)' : allowedOrigins}`);
  console.log(`=======================================================`);
});
