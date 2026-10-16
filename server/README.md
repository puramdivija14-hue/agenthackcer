# Opportunity Radar Backend (Render Service) 🚀

This is the Node.js Express backend service for the **Opportunity Reminder Agent** and **Radar Copilot AI Chatbot**.

---

## 🌟 Features
- **Secure Gemini API Gateway:** Stores your `GEMINI_API_KEY` securely on the server (never exposed to browser clients).
- **Radar Copilot AI Chatbot API:** `/api/chat` with live IST and deadline context injection.
- **AI Extraction & Recommendation Endpoints:** `/api/gemini/extract`, `/api/gemini/recommend`, `/api/gemini/milestones`.
- **CORS Configured for Vercel:** Seamlessly accepts requests from your deployed Vercel frontend or `localhost`.
- **Health & Monitoring:** Native `/health` status endpoint for Render keep-alive and ping tests.

---

## 🚀 How to Deploy on Render

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository (`puramdivija14-hue/agenthackcer`).
4. Configure the Web Service settings:
   - **Name:** `opportunity-radar-backend`
   - **Region:** Singapore / Frankfurt / Oregon (any near your users)
   - **Branch:** `main`
   - **Root Directory:** `server` *(Important!)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = *[Your Google Gemini API Key]*
   - `CORS_ORIGIN` = `*` (or your Vercel domain e.g. `https://your-app.vercel.app`)
   - `NODE_ENV` = `production`
6. Click **Create Web Service**.
7. Once deployed, copy your Render URL:  
   `https://opportunity-radar-backend.onrender.com`

---

## 💻 Local Development

```bash
cd server
npm install
npm run dev
```

Server starts on `http://localhost:5000`. Test via:
```bash
curl http://localhost:5000/health
```
