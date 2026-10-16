# Opportunity Reminder Agent 🎓⚡

> **Personal Opportunity Radar & Deadline Reminder Agent for College Students**  
> Built with HTML5, Vanilla CSS3, and JavaScript (ES6+). Zero paid APIs, no complicated database setup, 100% private `localStorage` persistence with Indian Standard Time (IST) deadline calculation.

---

## 🌟 Overview & Objectives

College students frequently miss out on prestigious hackathons, free cloud certification exam vouchers (Google Cloud, Microsoft Learn, AWS), scholarship deadlines, and off-campus internships simply because deadlines are scattered across dozens of platforms or buried in chat groups.

The **Opportunity Reminder Agent** acts as an organized command center:
1. **Discovers & Organizes Authentic Opportunities:** Direct verified access to official platforms (Unstop, Devpost, Google Cloud Skills Boost, Google for Developers, Microsoft Learn, AWS Skill Builder, HackerEarth).
2. **Tracks College & Personal Deadlines:** Keep track of semester assignments, lab submissions, exam dates, LeetCode practice streaks, fees, and interviews in one unified place.
3. **Calculates Real-Time Urgency:** Automatic countdown clock displaying exact days remaining, color-coded urgency badges, and separate handling for overdue items.
4. **Protects Your Data:** Completely offline-first with JSON export/import backups and safe sample data purging that never wipes your authentic records.

---

## 🎨 Color Palette & Visual Aesthetics

The application implements a custom curated palette engineered for readability, focus, and visual flair:
- **Warm Cream (`#FDFBF7`, `#F6F2E8`):** Clean, non-fatiguing backdrop mimicking premium stationery.
- **Royal Purple (`#635BFF`):** Inspiring accent for primary actions, categories, and brand identity.
- **Emerald Green (`#10B981`):** Represents completed milestones, free opportunities, and verified statuses.
- **Warm Orange / Amber (`#F59E0B`, `#EA580C`):** Highlights urgent items closing within 7 days and high-priority tasks.
- **Crimson Alert (`#EF4444`):** Flags overdue tasks requiring immediate intervention.
- **Full Dark Mode:** Midnight Obsidian (`#0F111A`) with glowing neon accents for late-night college study sessions.

---

## 🚀 Key Features

### 1. Central Dashboard
- **Live IST Clock & Date:** Real-time Indian Standard Time (Asia/Kolkata) clock updated every second.
- **Metrics Radar:** Instant counters for Total Opportunities, Saved items, Deadlines closing within 7 days, Pending tasks, and Completed milestones.
- **Closing Soon Radar:** Real-time spotlight on opportunities with deadlines in less than 7 days.
- **Today's Focus & Overdue List:** Immediate checklist of academic tasks due today or requiring catch-up.
- **Quick Launchpad:** One-click links directly into Unstop, Devpost, Google Cloud Skills Boost, and Microsoft Learn.

### 2. Opportunity Finder
- **Category Tabs:** Filter instantly by *Hackathons*, *Certifications*, *Internships*, *Scholarships*, *Free Courses*, and *Workshops*.
- **Cost & Status Filters:** Filter by 100% Free vs Paid/Voucher; filter by Bookmarked / Saved, Registered, or Completed.
- **Manual Opportunity Logger:** Add any program you encounter with Title, Category, Portal URL, Deadline Date, Cost, Eligibility criteria, and personal notes.
- **Authenticity Standard:** Sample starter items are explicitly badged as `[Sample Data]`. Users can remove sample items at any time with the "Purge Samples" button without affecting their custom entries.

### 3. Personal Reminder Manager
- **Category Support:** College Assignments, Semester/Midterm Exams, Project Milestones, LeetCode Streaks, Fee Payments, Appointments, and Birthdays.
- **Priority Levels:** High (Urgent), Medium, and Low.
- **Filter Tabs:** View tasks sorted into *All*, *Due Today*, *Upcoming*, *Overdue*, and *Completed*.
- **Interactive Check-off:** Mark items done with celebratory feedback or reopen them anytime.
- **Quick Snooze:** Extend any task deadline by +1 day with a single click.

### 4. Interactive Deadline Calendar & Calendar Sync Engine 📅
- **Full Monthly Grid (IST):** Visual overview of your academic and extracurricular month with real-time Indian Standard Time synchronization.
- **Color-Coded Deadline Chips:** Distinguishes hackathons/certifications (purple) from assignments, exams, and milestones (amber/green/red).
- **One-Click Google Calendar Sync:** Every opportunity card, reminder card, and calendar day has a direct "Add to Google Calendar" button pre-configured with the event title, details, and exact IST deadline.
- **Universal `.ics` iCalendar Export:** Download RFC-5545 `.ics` event files with built-in 24-hour and 2-hour pre-deadline alarm notifications that fire natively on iOS, Android, macOS, and Windows.
- **Export Complete Schedule:** Export your entire semester's deadlines into a single `college_opportunity_radar_deadlines.ics` file for native mobile calendar apps.
- **Day Inspector Modal:** Click on any calendar date to view all scheduled items, launch official portals, or log a new opportunity or task pre-filled for that day.

### 5. Smart Notification System
- **In-App Alert Drawer:** Clicking the notification bell opens an alert center summarizing all overdue tasks, items due today, and opportunities closing within 7 days.
- **Web Notification API:** Request local browser notification permissions with one click.
- **Clear Engineering Transparency:** Browser notifications only trigger when the browser or tab is active. For guaranteed notifications when your computer is shut down, use our included Google Apps Script daily email solution below!

### 6. Gemini AI Opportunity Scout & Assistant ✨
- **Configured with Google Gemini API:** Uses your key for smart intelligence tasks.
- **Announcement Extractor:** Paste unstructured announcements, WhatsApp notices, or emails. Gemini extracts Title, Category, Deadline, Eligibility, Cost, and Portal link, then loads it with one click.
- **Tailored Recommendations:** Tell Gemini your undergrad year and interest area (e.g. AI, Full-Stack, Cloud) to get 3 targeted opportunities.
- **Exam & Milestone Generator:** Enter an exam or project and Gemini generates a step-by-step checklist of prep milestones with due dates that you can add directly to your Personal Reminders!
- **API Key Management:** View, test, or update your API key in **Backup & Settings** with live latency testing.

### 7. Radar Copilot Interactive AI Chatbot 🤖💬
- **Global Floating Widget:** Accessible across all views (Dashboard, Opportunities, Reminders, Calendar, Settings) via the floating launcher button in the bottom-right corner.
- **Context-Aware Intelligence:** Automatically feeds your live IST date/time, closing-soon opportunities, and pending deadlines into conversations (e.g., *"What is closing soon?"*, *"What are my pending tasks?"*).
- **Agentic Action Execution:** Instruct the Copilot in plain natural language (e.g., *"Add reminder: OS Lab submission due Friday"* or *"Track hackathon: Smart India Hackathon due 2026-11-15"*). The Copilot generates executable action blocks that automatically create new reminders or opportunities, syncs to `localStorage`, and refreshes the UI in real time.
- **Voice Dictation (Web Speech API):** Click the microphone icon to dictate questions or new reminders hands-free with speech-to-text.
- **Quick Suggestion Chips:** One-tap starter prompts for instant schedule checks, study milestone roadmaps, and opportunity tracking.
- **Conversation Memory & Persistence:** Remembers chat history across tabs and refreshes using local storage with a one-click "Clear History" button.
- **Smart Fallback Engine:** Features built-in heuristic pattern matching to answer common schedule questions and execute actions even when working offline or before configuring an API key.

### 8. Data Privacy & Backup
- **100% Client-Side:** Everything is stored in your browser's `localStorage`.
- **JSON Export:** Download a `.json` backup file with all your opportunities and reminders.
- **JSON Import:** Restore backup files with your choice of **Merge** (non-destructive) or **Replace** mode.
- **Sample Data Purge:** Clean out default demo entries while retaining all authentic records you added.

---

## 📁 Project Structure

```text
divija98276/
├── vercel.json           # Vercel configuration for static frontend hosting
├── render.yaml           # Render Blueprint for 1-click backend web service deployment
├── config.js             # API keys, Render Backend URL, model configuration & key masking
├── index.html            # Semantic HTML5 layout, accessible dialogs, AI Scout, and navigation
├── style.css             # Modern styling, cream/purple/green/orange palette, dark/light theme
├── script.js             # Vanilla ES6+ controller, Gemini client, localStorage CRUD, IST calculations
├── README.md             # Comprehensive documentation, API setup, Vercel & Render guide
└── server/               # Render Backend Service (Node.js & Express)
    ├── package.json      # Express, CORS, and Dotenv dependencies
    ├── server.js         # API gateway with Gemini endpoints, health check & CORS
    ├── .env.example      # Template for environment variables (GEMINI_API_KEY, PORT)
    ├── .gitignore        # Ignores server node_modules & .env
    └── README.md         # Backend deployment instructions
```

---

## ☁️ Cloud Deployment Guide: Vercel (Frontend) & Render (Backend)

The project is structured with a decoupled modern architecture:
- **Frontend (Vercel):** Lightning-fast global CDN for static assets (`index.html`, `style.css`, `script.js`).
- **Backend (Render):** Secure Node.js Express API service for server-side Google Gemini intelligence, keeping your API key 100% secret and safe from browser exposure.

---

### Part 1: Deploy Backend to Render (Node.js API)

1. **Sign in to Render:** Go to [dashboard.render.com](https://dashboard.render.com) and log in with your GitHub account.
2. **Create New Web Service:**
   - Click **New +** -> **Web Service**.
   - Select **Build and deploy from a Git repository**.
   - Choose your repository: `puramdivija14-hue/agenthackcer`.
3. **Configure Service Settings:**
   - **Name:** `opportunity-radar-backend` (or any custom name)
   - **Region:** Singapore / Frankfurt / Oregon
   - **Branch:** `main`
   - **Root Directory:** `server` *(Important: set this to `server`)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
4. **Configure Environment Variables:**
   Under **Environment Variables**, click **Add Environment Variable**:
   - `GEMINI_API_KEY`: Paste your Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/app/apikey))
   - `CORS_ORIGIN`: `*` (or your future Vercel domain e.g. `https://*.vercel.app`)
   - `NODE_ENV`: `production`
5. **Deploy:** Click **Create Web Service**.
6. **Copy Your Backend URL:**
   Once the status turns to **Live**, copy your public Render URL (e.g., `https://opportunity-radar-backend.onrender.com`).
   - You can test it by visiting: `https://opportunity-radar-backend.onrender.com/health`

---

### Part 2: Deploy Frontend to Vercel (Static Web App)

1. **Sign in to Vercel:** Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. **Import Repository:**
   - Click **Add New...** -> **Project**.
   - Under *Import Git Repository*, select `puramdivija14-hue/agenthackcer`.
3. **Configure Project:**
   - **Framework Preset:** `Other` (or leave default detected)
   - **Root Directory:** `./` (leave default)
   - **Build and Output Settings:** Leave default (the repository includes `vercel.json` for automatic configuration)
4. **Deploy:** Click **Deploy**.
5. **Get Live URL:** In less than 30 seconds, Vercel will provide your live URL (e.g., `https://agenthackcer.vercel.app`).

---

### Part 3: Link Vercel Frontend to Render Backend

Once both are deployed:
1. Open your deployed Vercel frontend in your browser.
2. In the sidebar, go to **Backup & Settings**.
3. Locate the **Cloud Deployment: Vercel (Frontend) & Render (Backend)** card.
4. In the **Render Backend Service URL** field, paste your Render URL:
   ```text
   https://opportunity-radar-backend.onrender.com
   ```
5. Click **Save Backend URL**, then click **⚡ Ping Backend (/health)** to test the live connection!
   - You will see: `✅ Render Backend Online (120ms) — 🟢 Gemini API Key configured on server`.
6. That's it! Your Radar Copilot Chatbot and AI Scout will now execute through your secure Render backend.

---

---

## 💻 How to Run the Application in Google Antigravity IDE

You do not need to install Node.js, npm packages, or external web servers to use this application.

### Method 1: Using Built-in Browser Preview (Recommended)
1. In the **Antigravity IDE**, open `index.html`.
2. Right-click anywhere in the editor and select **"Open with Live Server"** or click the **Preview** button in the top right.
3. The interactive web application will open in an integrated browser tab.

### Method 2: Using Python's Built-in HTTP Server
In your Antigravity terminal / PowerShell:
```powershell
python -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

### Method 3: Direct File Launch
Simply double-click `index.html` in your file explorer to launch it directly in Chrome, Edge, Brave, or Firefox.

---

## 📬 Automated Daily Morning Gmail Reminders (Google Apps Script)

Browser web notifications only fire while your laptop is awake and the browser tab is open. To receive an automated summary in your **Gmail inbox every morning at 7:30 AM IST** without running any paid servers, use this free Google Apps Script integration:

### Step 1: Open Google Apps Script
1. Go to [script.google.com](https://script.google.com) in your browser.
2. Click **+ New Project**.
3. Rename the project to `Opportunity Radar Daily Digest`.

### Step 2: Paste the Automation Code
Delete any default text in `Code.gs` and paste the following snippet:

```javascript
function sendDailyOpportunityBriefing() {
  // Automatically detects your active Gmail address
  var recipientEmail = Session.getActiveUser().getEmail();
  var today = new Date();
  
  // Format Date for India Standard Time (IST)
  var formattedDate = Utilities.formatDate(today, "Asia/Kolkata", "EEEE, dd MMMM yyyy");
  
  var emailSubject = "🎓 Daily Opportunity & Deadline Radar - " + formattedDate;
  
  // Responsive HTML Email Body
  var htmlBody = "<div style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; max-width:600px; margin:auto; padding:24px; border:1px solid #E5E0D5; border-radius:14px; background:#FDFBF7; color:#1E2433;'>"
    + "<div style='background: linear-gradient(135deg, #635BFF 0%, #4F46E5 100%); color:#ffffff; padding:20px; border-radius:10px; text-align:center;'>"
    + "<h2 style='margin:0; font-size:20px;'>Daily Student Opportunity Radar</h2>"
    + "<p style='margin:6px 0 0; font-size:13px; opacity:0.9;'>" + formattedDate + " (IST)</p>"
    + "</div>"
    + "<div style='padding:20px 0;'>"
    + "<p style='font-size:15px; line-height:1.6;'>Good morning! Here is your daily reminder to review your pending college assignments, Google certifications, and hackathon registration deadlines.</p>"
    + "<div style='background:#FEF3C7; border-left:4px solid #F59E0B; padding:14px; margin:16px 0; border-radius:6px;'>"
    + "<strong style='color:#B45309; font-size:14px;'>⚡ Action Required Today:</strong><br>"
    + "<span style='font-size:13px; color:#78350F;'>Open your local <strong>Opportunity Reminder Agent</strong> dashboard to check items closing within 7 days.</span>"
    + "</div>"
    + "<div style='background:#EEECFF; border-left:4px solid #635BFF; padding:14px; margin:16px 0; border-radius:6px;'>"
    + "<strong style='color:#4338CA; font-size:14px;'>🎯 Top Verification Portals:</strong><br>"
    + "<ul style='margin:8px 0 0; padding-left:20px; font-size:13px; color:#3730A3;'>"
    + "<li><a href='https://unstop.com' style='color:#4338CA;'>Unstop Hackathons & Hiring</a></li>"
    + "<li><a href='https://www.cloudskillsboost.google' style='color:#4338CA;'>Google Cloud Skills Boost Arcade</a></li>"
    + "<li><a href='https://learn.microsoft.com' style='color:#4338CA;'>Microsoft Learn Student Challenges</a></li>"
    + "</ul>"
    + "</div>"
    + "<p style='font-size:12px; color:#94A3B8; margin-top:24px; text-align:center;'>Automated by Google Apps Script Time-Driven Trigger &bull; 100% Free</p>"
    + "</div></div>";
    
  MailApp.sendEmail({
    to: recipientEmail,
    subject: emailSubject,
    htmlBody: htmlBody
  });
  
  Logger.log("Briefing successfully dispatched to " + recipientEmail);
}
```

### Step 3: Authorize and Test
1. Click the **Save** icon (`Ctrl + S`).
2. Click the **Run** button on the top toolbar.
3. Google will show an *Authorization Required* pop-up (to allow sending an email from your own Gmail account to yourself). Click **Review Permissions**, select your Google account, and grant access.
4. Check your Gmail inbox: you will see the formatted test email immediately!

### Step 4: Schedule the Automatic 7:30 AM Daily Trigger
1. In Google Apps Script, click the **Clock Icon (Triggers)** on the left sidebar.
2. Click **+ Add Trigger** (bottom right).
3. Set the following fields:
   - **Choose which function to run:** `sendDailyOpportunityBriefing`
   - **Select event source:** `Time-driven`
   - **Select type of time based trigger:** `Day timer`
   - **Select time of day:** `7am to 8am` (in your local timezone)
4. Click **Save**.

Your automated cloud reminder is now fully active, completely free, and will run regardless of whether your laptop is on or off.

---

## 🔒 Data Safety & Backup Instructions

1. **Creating a Backup:**
   - Navigate to the **Backup & Sync** view from the sidebar navigation.
   - Click **Export JSON Backup**.
   - A file named `opportunity_agent_backup_YYYY-MM-DD.json` will be saved to your Downloads folder.

2. **Restoring a Backup:**
   - Under **Backup & Sync**, click on the file drop area to choose your `.json` file.
   - Choose **Merge with existing records** (adds new items without deleting current ones) or **Replace existing records**.

3. **Clearing Sample Data:**
   - If you want a blank canvas for your own opportunities, click **Clear Sample Records Only** in the Danger Zone or the orange banner in Opportunity Finder.
   - All sample items marked with `[Sample Data]` will be removed, leaving any opportunities or tasks you personally logged intact.

---

## 🛡️ License
Open-source personal productivity tool designed for college students and lifelong learners. Distributed under the MIT License.
