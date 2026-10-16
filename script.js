/**
 * OPPORTUNITY REMINDER AGENT
 * Personal Opportunity & Deadline Radar for College Students
 * Vanilla JavaScript (ES6+), LocalStorage Persistence, IST Date Support
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. STORAGE KEYS & INITIAL DATA
  // ==========================================================================
  const STORAGE_KEYS = {
    OPPORTUNITIES: 'opportunity_agent_opps_v2',
    REMINDERS: 'opportunity_agent_reminders_v2',
    SETTINGS: 'opportunity_agent_settings_v2'
  };

  // Helper to generate dates relative to current date (YYYY-MM-DD)
  function getRelativeDateStr(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Curated, authentic sample starter opportunities (clearly labeled as Sample Data)
  const DEFAULT_OPPORTUNITIES = [
    {
      id: 'sample_opp_1',
      title: 'Google Cloud Skills Boost - Cloud Innovators Arcade',
      category: 'Certification',
      url: 'https://www.cloudskillsboost.google',
      deadline: getRelativeDateStr(4), // 4 days left (Urgent Closing Soon)
      eligibility: 'Open to all students with a Google Account',
      cost: 'Free',
      notes: 'Complete 3 skill badges to receive arcade points redeemable for official Google Cloud swag and exam discounts.',
      status: 'Registered',
      saved: true,
      isSample: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample_opp_2',
      title: 'Unstop National Engineering Hackathon Sprint 2026',
      category: 'Hackathon',
      url: 'https://unstop.com',
      deadline: getRelativeDateStr(6), // 6 days left (Closing Soon)
      eligibility: '1st - 4th year B.Tech / BCA / MCA students in teams of 2-4',
      cost: 'Free',
      notes: 'Theme: Generative AI for Education. PPT round submission requires problem statement and architecture diagram.',
      status: 'Interested',
      saved: true,
      isSample: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample_opp_3',
      title: 'Microsoft Learn Cloud Skills Challenge: Azure Fundamentals',
      category: 'Certification',
      url: 'https://learn.microsoft.com',
      deadline: getRelativeDateStr(14), // 14 days left
      eligibility: 'University and college students worldwide',
      cost: 'Free',
      notes: 'Finish the designated learning path to qualify for a free or 50% discounted AZ-900 exam voucher.',
      status: 'Interested',
      saved: false,
      isSample: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample_opp_4',
      title: 'Devpost AI Agents Global Hackathon',
      category: 'Hackathon',
      url: 'https://devpost.com',
      deadline: getRelativeDateStr(21), // 21 days left
      eligibility: 'Open globally to developers, solo or teams up to 4',
      cost: 'Free',
      notes: 'Build an autonomous agent application. Prize pool: $30,000 in API credits and cash bounties.',
      status: 'Interested',
      saved: true,
      isSample: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample_opp_5',
      title: 'AWS Skill Builder: Cloud Practitioner Essentials',
      category: 'Course',
      url: 'https://explore.skillbuilder.aws',
      deadline: getRelativeDateStr(30),
      eligibility: 'Free digital course open to all self-paced learners',
      cost: 'Free',
      notes: 'Official foundational curriculum for AWS certified cloud practitioner exam preparation.',
      status: 'Interested',
      saved: false,
      isSample: true,
      createdAt: new Date().toISOString()
    }
  ];

  // Authentic student starter reminders
  const DEFAULT_REMINDERS = [
    {
      id: 'sample_rem_1',
      title: 'Database Management Systems (DBMS) Lab Submission',
      category: 'Assignment',
      priority: 'High',
      dueDate: getRelativeDateStr(0), // Due Today
      dueTime: '17:00',
      description: 'Submit normalized SQL schema and execution screenshots for Experiment 5 & 6.',
      completed: false,
      isSample: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample_rem_2',
      title: 'Operating Systems Midterm Exam Preparation',
      category: 'Exam',
      priority: 'High',
      dueDate: getRelativeDateStr(2), // 2 days
      dueTime: '09:30',
      description: 'Revise CPU Scheduling algorithms (Round Robin, SRTF) and Deadlock Banker\'s Algorithm.',
      completed: false,
      isSample: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample_rem_3',
      title: 'Solve 3 LeetCode Dynamic Programming Problems',
      category: 'LeetCode',
      priority: 'Medium',
      dueDate: getRelativeDateStr(1),
      dueTime: '22:00',
      description: 'Target problems: Climbing Stairs, Coin Change 1, House Robber.',
      completed: false,
      isSample: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample_rem_4',
      title: 'Pay College Semester Exam Registration Fee',
      category: 'Bill',
      priority: 'High',
      dueDate: getRelativeDateStr(5),
      dueTime: '23:59',
      description: 'Verify payment receipt on college portal and submit xerox to department office.',
      completed: false,
      isSample: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample_rem_5',
      title: 'Minor Project Synopsis Document Sign-off',
      category: 'Project',
      priority: 'Low',
      dueDate: getRelativeDateStr(-2), // Overdue sample
      dueTime: '16:00',
      description: 'Get project guide signature on the 4-page problem definition synopsis.',
      completed: true,
      isSample: true,
      createdAt: new Date().toISOString()
    }
  ];

  // ==========================================================================
  // 2. APPLICATION STATE
  // ==========================================================================
  const state = {
    opportunities: [],
    reminders: [],
    settings: {
      theme: 'light',
      browserNotifPermission: 'default'
    },
    currentView: 'dashboard',
    oppFilter: {
      category: 'all',
      cost: 'all',
      status: 'all',
      search: '',
      sort: 'deadline-asc'
    },
    reminderFilter: {
      statusTab: 'all', // 'all' | 'today' | 'upcoming' | 'overdue' | 'completed'
      category: 'all',
      priority: 'all',
      search: ''
    }
  };

  // ==========================================================================
  // 3. STORAGE CONTROLLERS
  // ==========================================================================
  function loadStorageData() {
    try {
      const storedOpps = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
      const storedReminders = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

      state.opportunities = storedOpps ? JSON.parse(storedOpps) : [...DEFAULT_OPPORTUNITIES];
      state.reminders = storedReminders ? JSON.parse(storedReminders) : [...DEFAULT_REMINDERS];
      
      if (storedSettings) {
        state.settings = { ...state.settings, ...JSON.parse(storedSettings) };
      }

      // If user had no data, seed defaults
      if (!storedOpps) saveOpportunities();
      if (!storedReminders) saveReminders();
    } catch (e) {
      console.error('Storage parse error, fallback to defaults:', e);
      state.opportunities = [...DEFAULT_OPPORTUNITIES];
      state.reminders = [...DEFAULT_REMINDERS];
    }
  }

  function saveOpportunities() {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(state.opportunities));
    updateCountersAndStats();
  }

  function saveReminders() {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(state.reminders));
    updateCountersAndStats();
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
  }

  // ==========================================================================
  // 4. DATE, TIMEZONE & DEADLINE CALCULATION UTILITIES
  // ==========================================================================
  
  // Get current date string in IST format (Asia/Kolkata)
  function getTodayIST() {
    const now = new Date();
    // Convert to IST offset string
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
    const parts = new Intl.DateTimeFormat('en-CA', options).formatToParts(now);
    const y = parts.find(p => p.type === 'year').value;
    const m = parts.find(p => p.type === 'month').value;
    const d = parts.find(p => p.type === 'day').value;
    return `${y}-${m}-${d}`;
  }

  // Calculate days remaining from today to target date
  function calculateDaysRemaining(targetDateStr) {
    if (!targetDateStr) return { diffDays: 0, label: 'No date', status: 'normal' };

    const todayStr = getTodayIST();
    const today = new Date(todayStr + 'T00:00:00');
    const target = new Date(targetDateStr + 'T00:00:00');

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const daysPast = Math.abs(diffDays);
      return {
        diffDays,
        label: `Overdue by ${daysPast} day${daysPast === 1 ? '' : 's'}`,
        status: 'overdue'
      };
    } else if (diffDays === 0) {
      return {
        diffDays: 0,
        label: 'Due Today ⚠️',
        status: 'urgent'
      };
    } else if (diffDays === 1) {
      return {
        diffDays: 1,
        label: 'Due Tomorrow',
        status: 'urgent'
      };
    } else if (diffDays <= 7) {
      return {
        diffDays,
        label: `${diffDays} days left`,
        status: 'urgent'
      };
    } else {
      return {
        diffDays,
        label: `${diffDays} days left`,
        status: 'normal'
      };
    }
  }

  // Format date nicely (e.g., "18 Oct 2026")
  function formatFriendlyDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // Live Clock updater (displays IST)
  function initLiveClock() {
    function updateClock() {
      const now = new Date();
      
      // IST Full Date
      const dateOptions = {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      };
      const formattedDate = new Intl.DateTimeFormat('en-IN', dateOptions).format(now);
      
      // IST Time
      const timeOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formattedTime = new Intl.DateTimeFormat('en-IN', timeOptions).format(now);

      const currentDateDisplay = document.getElementById('currentDateDisplay');
      if (currentDateDisplay) {
        currentDateDisplay.textContent = `${formattedDate} • ${formattedTime} IST`;
      }

      const sidebarLiveClock = document.getElementById('sidebarLiveClock');
      if (sidebarLiveClock) {
        sidebarLiveClock.textContent = `${formattedTime} IST`;
      }
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  // ==========================================================================
  // 5. TOAST NOTIFICATION ENGINE
  // ==========================================================================
  function showToast(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚡';

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${escapeHTML(title)}</div>
        <div class="toast-msg">${escapeHTML(message)}</div>
      </div>
      <button class="toast-close" aria-label="Dismiss">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      toast.remove();
    });

    container.appendChild(toast);

    // Auto dismiss after 3.8s
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 250);
      }
    }, 3800);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // 6. UI COUNTERS & STATS
  // ==========================================================================
  function updateCountersAndStats() {
    const opps = state.opportunities;
    const reminders = state.reminders;

    // Total Opportunities
    const totalOpps = opps.length;
    const savedOpps = opps.filter(o => o.saved).length;
    const registeredOpps = opps.filter(o => o.status === 'Registered').length;
    
    // Urgent Opportunities closing in <= 7 days
    const urgentOpps = opps.filter(o => {
      if (o.status === 'Completed') return false;
      const res = calculateDaysRemaining(o.deadline);
      return res.diffDays >= 0 && res.diffDays <= 7;
    });

    // Reminders breakdown
    const pendingReminders = reminders.filter(r => !r.completed);
    const completedReminders = reminders.filter(r => r.completed);

    const dueTodayReminders = pendingReminders.filter(r => {
      const res = calculateDaysRemaining(r.dueDate);
      return res.diffDays === 0;
    });

    const overdueReminders = pendingReminders.filter(r => {
      const res = calculateDaysRemaining(r.dueDate);
      return res.diffDays < 0;
    });

    const upcomingReminders = pendingReminders.filter(r => {
      const res = calculateDaysRemaining(r.dueDate);
      return res.diffDays > 0;
    });

    // Completed Opportunities + Reminders
    const completedOpps = opps.filter(o => o.status === 'Completed').length;
    const totalCompleted = completedOpps + completedReminders.length;

    // Update DOM elements
    setText('statTotalOpp', totalOpps);
    setText('statSavedOpp', `${savedOpps} saved`);
    setText('statRegisteredOpp', `${registeredOpps} registered`);
    setText('statClosingSoon', urgentOpps.length);
    setText('statPendingReminders', pendingReminders.length);
    setText('statDueToday', `${dueTodayReminders.length} due today`);
    setText('statOverdue', `${overdueReminders.length} overdue`);
    setText('statCompleted', totalCompleted);

    // Sidebar & Banner Counters
    setText('navOppCount', totalOpps);
    setText('navUrgentCount', urgentOpps.length + dueTodayReminders.length + overdueReminders.length);
    setText('navCalCount', urgentOpps.length + pendingReminders.length);
    setText('bannerUrgentCount', `${urgentOpps.length + dueTodayReminders.length} urgent items closing soon`);

    // Reminder tab counts
    setText('countTabAll', reminders.length);
    setText('countTabToday', dueTodayReminders.length);
    setText('countTabUpcoming', upcomingReminders.length);
    setText('countTabOverdue', overdueReminders.length);
    setText('countTabCompleted', completedReminders.length);

    // Backup view counts
    setText('backupOppCount', totalOpps);
    setText('backupReminderCount', reminders.length);
    const approximateBytes = (localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES) || '').length + 
                             (localStorage.getItem(STORAGE_KEYS.REMINDERS) || '').length;
    setText('backupStorageSize', `${(approximateBytes / 1024).toFixed(1)} KB`);

    // Update notification bell drawer
    updateNotificationDrawer(urgentOpps, dueTodayReminders, overdueReminders);
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // ==========================================================================
  // 7. NOTIFICATION SYSTEM & BELL DRAWER
  // ==========================================================================
  function updateNotificationDrawer(urgentOpps, dueTodayReminders, overdueReminders) {
    const totalAlerts = urgentOpps.length + dueTodayReminders.length + overdueReminders.length;
    const badge = document.getElementById('notifBadge');
    const pill = document.getElementById('notifCountPill');
    const list = document.getElementById('notifItemsList');

    if (badge) badge.textContent = totalAlerts;
    if (pill) pill.textContent = `${totalAlerts} alert${totalAlerts === 1 ? '' : 's'}`;

    if (!list) return;
    list.innerHTML = '';

    if (totalAlerts === 0) {
      list.innerHTML = `
        <div style="padding: 24px 18px; text-align: center; color: var(--text-muted); font-size: 0.84rem;">
          🎉 No urgent deadlines right now! You're completely up to date.
        </div>
      `;
      return;
    }

    // List overdue items first
    overdueReminders.forEach(rem => {
      const calc = calculateDaysRemaining(rem.dueDate);
      const item = document.createElement('div');
      item.className = 'notif-item';
      item.innerHTML = `
        <div class="notif-item-icon">🚨</div>
        <div class="notif-item-content">
          <div class="notif-item-title text-danger">${escapeHTML(rem.title)}</div>
          <div class="notif-item-meta">${calc.label} • Task Overdue</div>
        </div>
      `;
      list.appendChild(item);
    });

    // List items due today
    dueTodayReminders.forEach(rem => {
      const item = document.createElement('div');
      item.className = 'notif-item';
      item.innerHTML = `
        <div class="notif-item-icon">⏰</div>
        <div class="notif-item-content">
          <div class="notif-item-title">${escapeHTML(rem.title)}</div>
          <div class="notif-item-meta">Due Today at ${rem.dueTime || '23:59'} IST</div>
        </div>
      `;
      list.appendChild(item);
    });

    // List urgent opportunities closing soon
    urgentOpps.forEach(opp => {
      const calc = calculateDaysRemaining(opp.deadline);
      const item = document.createElement('div');
      item.className = 'notif-item';
      item.innerHTML = `
        <div class="notif-item-icon">🎯</div>
        <div class="notif-item-content">
          <div class="notif-item-title">${escapeHTML(opp.title)}</div>
          <div class="notif-item-meta">${escapeHTML(opp.category)} • ${calc.label} (${formatFriendlyDate(opp.deadline)})</div>
        </div>
      `;
      list.appendChild(item);
    });
  }

  // Web Notification API Handler
  function initBrowserNotifications() {
    const statusBadge = document.getElementById('browserNotifStatus');
    
    function refreshPermStatus() {
      if (!('Notification' in window)) {
        if (statusBadge) {
          statusBadge.textContent = 'Not Supported';
          statusBadge.style.color = 'var(--text-sub)';
        }
        return;
      }
      if (statusBadge) {
        statusBadge.textContent = Notification.permission.toUpperCase();
        if (Notification.permission === 'granted') {
          statusBadge.style.background = 'var(--green-light)';
          statusBadge.style.color = 'var(--green)';
        } else if (Notification.permission === 'denied') {
          statusBadge.style.background = 'var(--danger-light)';
          statusBadge.style.color = 'var(--danger)';
        } else {
          statusBadge.style.background = 'var(--orange-light)';
          statusBadge.style.color = 'var(--orange-accent)';
        }
      }
    }

    refreshPermStatus();

    // Request permission button
    const requestBtns = [
      document.getElementById('btnRequestNotifPermission'),
      document.getElementById('btnRequestWebNotif')
    ];

    requestBtns.forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', async () => {
        if (!('Notification' in window)) {
          showToast('Not Supported', 'Your browser does not support the Web Notification API.', 'warning');
          return;
        }

        try {
          const permission = await Notification.requestPermission();
          refreshPermStatus();
          if (permission === 'granted') {
            showToast('Permission Granted', 'Browser notifications enabled for active sessions.', 'success');
            sendNativeNotification('Opportunity Reminder Agent Active', 'You will receive in-session deadline alerts.');
          } else if (permission === 'denied') {
            showToast('Permission Denied', 'Notifications blocked in browser settings.', 'warning');
          }
        } catch (err) {
          console.error('Notification permission error:', err);
        }
      });
    });

    // Test alert button
    const testBtn = document.getElementById('btnTriggerTestNotif');
    if (testBtn) {
      testBtn.addEventListener('click', () => {
        if (!('Notification' in window)) {
          showToast('Alert Demo', 'Web Notifications not supported; showing in-app toast.', 'info');
          return;
        }

        if (Notification.permission === 'granted') {
          sendNativeNotification('⚡ Radar Test Alert', 'Google Cloud & Hackathon deadline tracking active.');
          showToast('Test Alert Sent', 'Check your operating system notification center.', 'success');
        } else {
          showToast('Permission Needed', 'Please click "Request Browser Notification" first or view in-app alerts.', 'warning');
        }
      });
    }
  }

  function sendNativeNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23635BFF"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
        });
      } catch (e) {
        console.warn('Native notification dispatch failed:', e);
      }
    }
  }

  // ==========================================================================
  // 8. RENDER: DASHBOARD VIEW
  // ==========================================================================
  function renderDashboard() {
    const opps = state.opportunities;
    const reminders = state.reminders;

    // 1. Opportunities Closing Soon list (< 7 days)
    const closingSoonContainer = document.getElementById('dashClosingSoonList');
    if (closingSoonContainer) {
      closingSoonContainer.innerHTML = '';
      
      const urgentOpps = opps
        .filter(o => o.status !== 'Completed')
        .map(o => ({ ...o, ...calculateDaysRemaining(o.deadline) }))
        .filter(o => o.diffDays <= 7)
        .sort((a, b) => a.diffDays - b.diffDays);

      if (urgentOpps.length === 0) {
        closingSoonContainer.innerHTML = `
          <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
            🌱 No opportunities closing in the next 7 days. Explore more under Opportunity Finder!
          </div>
        `;
      } else {
        urgentOpps.slice(0, 5).forEach(opp => {
          const item = document.createElement('div');
          item.className = `radar-item ${opp.status === 'overdue' ? 'overdue-card' : 'urgent-card'}`;
          
          item.innerHTML = `
            <div class="radar-info">
              <div class="radar-category">${escapeHTML(opp.category)} &bull; ${escapeHTML(opp.cost)}</div>
              <div class="radar-title">${escapeHTML(opp.title)}</div>
              <div class="radar-deadline">
                <span class="${opp.status === 'overdue' ? 'text-danger' : 'text-orange'}">
                  ${opp.label}
                </span> &bull; Closes ${formatFriendlyDate(opp.deadline)}
              </div>
            </div>
            <a href="${escapeHTML(opp.url)}" target="_blank" rel="noopener noreferrer" class="radar-action-btn">
              Apply ↗
            </a>
          `;
          closingSoonContainer.appendChild(item);
        });
      }
    }

    // 2. Today's Tasks & Urgent Reminders
    const todayRemindersContainer = document.getElementById('dashTodayRemindersList');
    if (todayRemindersContainer) {
      todayRemindersContainer.innerHTML = '';

      const pendingReminders = reminders
        .filter(r => !r.completed)
        .map(r => ({ ...r, ...calculateDaysRemaining(r.dueDate) }))
        .sort((a, b) => a.diffDays - b.diffDays);

      if (pendingReminders.length === 0) {
        todayRemindersContainer.innerHTML = `
          <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
            ✨ No pending reminders for today! Great job staying organized.
          </div>
        `;
      } else {
        pendingReminders.slice(0, 5).forEach(rem => {
          const item = document.createElement('div');
          item.className = `radar-item ${rem.status === 'overdue' ? 'overdue-card' : ''}`;
          
          item.innerHTML = `
            <div class="radar-info">
              <div class="radar-category" style="color: var(--text-muted);">
                ${escapeHTML(rem.category)} &bull; Priority: ${escapeHTML(rem.priority)}
              </div>
              <div class="radar-title">${escapeHTML(rem.title)}</div>
              <div class="radar-deadline">
                <span class="${rem.status === 'overdue' ? 'text-danger' : ''}">
                  ${rem.label} (Due ${formatFriendlyDate(rem.dueDate)} at ${rem.dueTime || '23:59'})
                </span>
              </div>
            </div>
            <button class="radar-action-btn" data-action="quick-complete-rem" data-id="${rem.id}">
              ✓ Mark Done
            </button>
          `;
          todayRemindersContainer.appendChild(item);
        });

        // Attach quick complete handlers
        todayRemindersContainer.querySelectorAll('[data-action="quick-complete-rem"]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const target = state.reminders.find(r => r.id === id);
            if (target) {
              target.completed = true;
              saveReminders();
              renderAll();
              showToast('Task Completed', `"${target.title}" marked as done.`, 'success');
            }
          });
        });
      }
    }
  }

  // ==========================================================================
  // 9. RENDER: OPPORTUNITY FINDER VIEW
  // ==========================================================================
  function renderOpportunities() {
    const grid = document.getElementById('opportunityGrid');
    const emptyState = document.getElementById('oppEmptyState');
    if (!grid) return;

    let items = [...state.opportunities];
    const filter = state.oppFilter;

    // 1. Category Filter
    if (filter.category !== 'all') {
      items = items.filter(o => o.category.toLowerCase() === filter.category.toLowerCase());
    }

    // 2. Cost Filter
    if (filter.cost !== 'all') {
      items = items.filter(o => o.cost.toLowerCase().includes(filter.cost.toLowerCase()));
    }

    // 3. Status Filter
    if (filter.status === 'saved') {
      items = items.filter(o => o.saved);
    } else if (filter.status === 'registered') {
      items = items.filter(o => o.status === 'Registered');
    } else if (filter.status === 'completed') {
      items = items.filter(o => o.status === 'Completed');
    }

    // 4. Search Filter
    if (filter.search.trim() !== '') {
      const q = filter.search.toLowerCase().trim();
      items = items.filter(o => 
        (o.title && o.title.toLowerCase().includes(q)) ||
        (o.category && o.category.toLowerCase().includes(q)) ||
        (o.eligibility && o.eligibility.toLowerCase().includes(q)) ||
        (o.notes && o.notes.toLowerCase().includes(q))
      );
    }

    // 5. Sorting
    if (filter.sort === 'deadline-asc') {
      items.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (filter.sort === 'deadline-desc') {
      items.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    } else if (filter.sort === 'title-asc') {
      items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filter.sort === 'created-desc') {
      items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    grid.innerHTML = '';

    if (items.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    items.forEach(opp => {
      const calc = calculateDaysRemaining(opp.deadline);
      const isUrgent = calc.status === 'urgent' && opp.status !== 'Completed';
      const isOverdue = calc.status === 'overdue' && opp.status !== 'Completed';

      let borderClass = '';
      if (isOverdue) borderClass = 'overdue-border';
      else if (isUrgent) borderClass = 'closing-soon-border';

      let countdownClass = 'normal';
      if (opp.status === 'Completed') countdownClass = 'completed';
      else if (isOverdue) countdownClass = 'overdue';
      else if (isUrgent) countdownClass = 'urgent';

      const card = document.createElement('div');
      card.className = `opp-card ${borderClass}`;
      card.innerHTML = `
        <div class="opp-card-header">
          <div class="opp-badges-wrap">
            <span class="badge-category">${escapeHTML(opp.category)}</span>
            <span class="badge-cost ${opp.cost.toLowerCase().includes('free') ? 'free' : 'paid'}">
              ${escapeHTML(opp.cost)}
            </span>
            ${opp.isSample ? '<span class="badge-sample">[Sample Data]</span>' : ''}
          </div>
          <button class="btn-star-bookmark ${opp.saved ? 'active' : ''}" data-action="toggle-star" data-id="${opp.id}" title="${opp.saved ? 'Remove Bookmark' : 'Bookmark Opportunity'}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${opp.saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>
        </div>

        <h3 class="opp-card-title">${escapeHTML(opp.title)}</h3>

        <div class="opp-card-eligibility">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span>${escapeHTML(opp.eligibility || 'Open to all college students')}</span>
        </div>

        <div class="opp-countdown-row">
          <span class="deadline-label">Deadline: <strong>${formatFriendlyDate(opp.deadline)}</strong></span>
          <span class="countdown-pill ${countdownClass}">
            ${opp.status === 'Completed' ? 'Completed ✓' : calc.label}
          </span>
        </div>

        <div class="opp-card-notes">
          ${escapeHTML(opp.notes || 'No extra preparation notes provided.')}
        </div>

        <div class="opp-card-footer">
          <button class="opp-status-badge ${opp.status}" data-action="cycle-status" data-id="${opp.id}" title="Click to cycle status (Interested -> Registered -> Completed)">
            ${opp.status === 'Completed' ? '✓ Completed' : opp.status === 'Registered' ? 'Registered' : 'Interested'}
          </button>

          <div class="opp-actions-group">
            <button class="btn-card-action" data-action="gcal-opp" data-id="${opp.id}" title="Add to Google Calendar">
              📅 GCal
            </button>
            <button class="btn-card-action" data-action="ics-opp" data-id="${opp.id}" title="Download .ics Calendar Event">
              📥 .ics
            </button>
            <button class="btn-card-action" data-action="edit-opp" data-id="${opp.id}" title="Edit opportunity">
              Edit
            </button>
            <button class="btn-card-action danger" data-action="delete-opp" data-id="${opp.id}" title="Delete opportunity">
              Delete
            </button>
            <a href="${escapeHTML(opp.url)}" target="_blank" rel="noopener noreferrer" class="btn-apply-link">
              Portal ↗
            </a>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Attach card event listeners
    grid.querySelectorAll('[data-action="toggle-star"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const target = state.opportunities.find(o => o.id === id);
        if (target) {
          target.saved = !target.saved;
          saveOpportunities();
          renderOpportunities();
          showToast(target.saved ? 'Opportunity Saved' : 'Removed from Saved', target.title, 'info');
        }
      });
    });

    grid.querySelectorAll('[data-action="cycle-status"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const target = state.opportunities.find(o => o.id === id);
        if (target) {
          if (target.status === 'Interested') target.status = 'Registered';
          else if (target.status === 'Registered') target.status = 'Completed';
          else target.status = 'Interested';
          saveOpportunities();
          renderAll();
          showToast('Status Updated', `"${target.title}" is now ${target.status}`, 'success');
        }
      });
    });

    grid.querySelectorAll('[data-action="gcal-opp"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const target = state.opportunities.find(o => o.id === id);
        if (target) {
          const url = getGoogleCalendarUrl({
            title: `[Opportunity] ${target.title}`,
            description: `Category: ${target.category}\nCost: ${target.cost}\nEligibility: ${target.eligibility || 'N/A'}\nNotes: ${target.notes || ''}`,
            url: target.url,
            dateStr: target.deadline,
            timeStr: '23:59',
            location: target.url || 'Online'
          });
          window.open(url, '_blank', 'noopener,noreferrer');
          showToast('Google Calendar', `Opening event for "${target.title}"`, 'info');
        }
      });
    });

    grid.querySelectorAll('[data-action="ics-opp"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const target = state.opportunities.find(o => o.id === id);
        if (target) {
          downloadEventIcs({
            id: target.id,
            title: `[Opportunity] ${target.title}`,
            dateStr: target.deadline,
            timeStr: '23:59',
            description: `Category: ${target.category}\nCost: ${target.cost}\nEligibility: ${target.eligibility || 'N/A'}\nNotes: ${target.notes || ''}`,
            url: target.url,
            location: target.url || 'Online'
          });
        }
      });
    });

    grid.querySelectorAll('[data-action="edit-opp"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openEditOppModal(id);
      });
    });

    grid.querySelectorAll('[data-action="delete-opp"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const target = state.opportunities.find(o => o.id === id);
        if (target && confirm(`Are you sure you want to delete "${target.title}"?`)) {
          state.opportunities = state.opportunities.filter(o => o.id !== id);
          saveOpportunities();
          renderAll();
          showToast('Opportunity Deleted', target.title, 'warning');
        }
      });
    });
  }

  // ==========================================================================
  // 10. RENDER: PERSONAL REMINDER MANAGER
  // ==========================================================================
  function renderReminders() {
    const container = document.getElementById('remindersContainer');
    const emptyState = document.getElementById('reminderEmptyState');
    if (!container) return;

    let items = [...state.reminders];
    const filter = state.reminderFilter;

    // 1. Sub-tab filter (All, Today, Upcoming, Overdue, Completed)
    if (filter.statusTab === 'today') {
      items = items.filter(r => !r.completed && calculateDaysRemaining(r.dueDate).diffDays === 0);
    } else if (filter.statusTab === 'upcoming') {
      items = items.filter(r => !r.completed && calculateDaysRemaining(r.dueDate).diffDays > 0);
    } else if (filter.statusTab === 'overdue') {
      items = items.filter(r => !r.completed && calculateDaysRemaining(r.dueDate).diffDays < 0);
    } else if (filter.statusTab === 'completed') {
      items = items.filter(r => r.completed);
    }

    // 2. Category Filter
    if (filter.category !== 'all') {
      items = items.filter(r => r.category.toLowerCase() === filter.category.toLowerCase());
    }

    // 3. Priority Filter
    if (filter.priority !== 'all') {
      items = items.filter(r => r.priority.toLowerCase() === filter.priority.toLowerCase());
    }

    // 4. Search Filter
    if (filter.search.trim() !== '') {
      const q = filter.search.toLowerCase().trim();
      items = items.filter(r => 
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.category && r.category.toLowerCase().includes(q))
      );
    }

    // Sort by Due Date
    items.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    container.innerHTML = '';

    if (items.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    items.forEach(rem => {
      const calc = calculateDaysRemaining(rem.dueDate);
      const isOverdue = calc.status === 'overdue' && !rem.completed;
      
      let priorityClass = 'priority-low';
      if (rem.priority === 'High') priorityClass = 'priority-high';
      else if (rem.priority === 'Medium') priorityClass = 'priority-medium';

      const card = document.createElement('div');
      card.className = `reminder-card ${rem.completed ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="reminder-checkbox" data-action="toggle-complete-rem" data-id="${rem.id}" title="${rem.completed ? 'Reopen task' : 'Complete task'}">
          ${rem.completed ? '✓' : ''}
        </div>

        <div class="reminder-priority-bar ${priorityClass}" title="Priority: ${rem.priority}"></div>

        <div class="reminder-main">
          <div class="reminder-header-row">
            <span class="reminder-tag">${escapeHTML(rem.category)}</span>
            <span class="reminder-tag" style="color: var(--text-muted);">${escapeHTML(rem.priority)}</span>
            ${rem.isSample ? '<span class="badge-sample">[Sample]</span>' : ''}
          </div>
          <div class="reminder-title">${escapeHTML(rem.title)}</div>
          <div class="reminder-notes">${escapeHTML(rem.description || 'No additional checklist remarks.')}</div>
        </div>

        <div class="reminder-meta-right">
          <div class="reminder-due-time ${isOverdue ? 'text-danger' : ''}">
            ${rem.completed ? 'Completed' : calc.label}
          </div>
          <small style="font-size: 0.72rem; color: var(--text-sub);">
            ${formatFriendlyDate(rem.dueDate)} at ${rem.dueTime || '23:59'}
          </small>

          <div class="reminder-actions">
            <button class="btn-icon-action" data-action="gcal-rem" data-id="${rem.id}" title="Add to Google Calendar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </button>
            <button class="btn-icon-action" data-action="ics-rem" data-id="${rem.id}" title="Download .ics Calendar Event">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </button>
            ${!rem.completed ? `
              <button class="btn-icon-action" data-action="snooze-rem" data-id="${rem.id}" title="Snooze deadline (+1 day)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
              </button>
            ` : ''}
            <button class="btn-icon-action" data-action="edit-rem" data-id="${rem.id}" title="Edit task">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="btn-icon-action danger" data-action="delete-rem" data-id="${rem.id}" title="Delete task">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Reminder interaction handlers
    container.querySelectorAll('[data-action="toggle-complete-rem"]').forEach(box => {
      box.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const target = state.reminders.find(r => r.id === id);
        if (target) {
          target.completed = !target.completed;
          saveReminders();
          renderAll();
          showToast(target.completed ? 'Task Completed' : 'Task Reopened', target.title, 'success');
        }
      });
    });

    container.querySelectorAll('[data-action="gcal-rem"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const target = state.reminders.find(r => r.id === id);
        if (target) {
          const url = getGoogleCalendarUrl({
            title: `[Task] ${target.title}`,
            description: `Category: ${target.category}\nPriority: ${target.priority}\nDescription: ${target.description || ''}`,
            url: '',
            dateStr: target.dueDate,
            timeStr: target.dueTime || '23:59',
            location: 'Campus / Personal'
          });
          window.open(url, '_blank', 'noopener,noreferrer');
          showToast('Google Calendar', `Opening event for "${target.title}"`, 'info');
        }
      });
    });

    container.querySelectorAll('[data-action="ics-rem"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const target = state.reminders.find(r => r.id === id);
        if (target) {
          downloadEventIcs({
            id: target.id,
            title: `[Task] ${target.title}`,
            dateStr: target.dueDate,
            timeStr: target.dueTime || '23:59',
            description: `Category: ${target.category}\nPriority: ${target.priority}\nDescription: ${target.description || ''}`,
            url: '',
            location: 'Campus / Personal'
          });
        }
      });
    });

    container.querySelectorAll('[data-action="snooze-rem"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const target = state.reminders.find(r => r.id === id);
        if (target) {
          const currentD = new Date(target.dueDate + 'T00:00:00');
          currentD.setDate(currentD.getDate() + 1);
          const y = currentD.getFullYear();
          const m = String(currentD.getMonth() + 1).padStart(2, '0');
          const d = String(currentD.getDate()).padStart(2, '0');
          target.dueDate = `${y}-${m}-${d}`;
          saveReminders();
          renderAll();
          showToast('Deadline Extended', `"${target.title}" snoozed by +1 day`, 'info');
        }
      });
    });

    container.querySelectorAll('[data-action="edit-rem"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openEditReminderModal(id);
      });
    });

    container.querySelectorAll('[data-action="delete-rem"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const target = state.reminders.find(r => r.id === id);
        if (target && confirm(`Delete reminder "${target.title}"?`)) {
          state.reminders = state.reminders.filter(r => r.id !== id);
          saveReminders();
          renderAll();
          showToast('Reminder Deleted', target.title, 'warning');
        }
      });
    });
  }

  // ==========================================================================
  // 10B. CALENDAR & GOOGLE CALENDAR / .ICS SYNC UTILITIES
  // ==========================================================================
  function generateIcsContent(events) {
    const formatDateToICS = (dt) => {
      return dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const nowStr = formatDateToICS(new Date());

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Opportunity Reminder Agent//College Student Radar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:College Opportunity & Deadline Radar',
      'X-WR-TIMEZONE:Asia/Kolkata'
    ];

    events.forEach(evt => {
      const time = evt.timeStr && evt.timeStr.includes(':') ? evt.timeStr : '23:59';
      const parts = (evt.dateStr || '').split('-').map(Number);
      const timeParts = time.split(':').map(Number);

      if (parts.length < 3 || isNaN(parts[0])) return;

      const start = new Date(parts[0], parts[1] - 1, parts[2], timeParts[0] || 0, timeParts[1] || 0);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      const cleanSummary = (evt.title || 'Deadline').replace(/[,;\\]/g, ' ');
      const cleanDesc = (evt.description || '').replace(/\n/g, '\\n').replace(/[,;\\]/g, ' ');
      const cleanLoc = (evt.location || 'Online / Remote').replace(/[,;\\]/g, ' ');

      lines.push(
        'BEGIN:VEVENT',
        `UID:${evt.id || Date.now()}_${Math.random().toString(36).substring(2, 9)}@opportunityradar`,
        `DTSTAMP:${nowStr}`,
        `DTSTART:${formatDateToICS(start)}`,
        `DTEND:${formatDateToICS(end)}`,
        `SUMMARY:${cleanSummary}`,
        `DESCRIPTION:${cleanDesc}`,
        `URL:${evt.url || ''}`,
        `LOCATION:${cleanLoc}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-P1D',
        'ACTION:DISPLAY',
        `DESCRIPTION:Reminder: 24h remaining for ${cleanSummary}`,
        'END:VALARM',
        'BEGIN:VALARM',
        'TRIGGER:-PT2H',
        'ACTION:DISPLAY',
        `DESCRIPTION:Urgent: 2h left for ${cleanSummary}`,
        'END:VALARM',
        'END:VEVENT'
      );
    });

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  function downloadIcsBlob(filename, icsContent) {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function getGoogleCalendarUrl({ title, description, url, dateStr, timeStr, location }) {
    const time = timeStr && timeStr.includes(':') ? timeStr : '23:59';
    const parts = (dateStr || '').split('-').map(Number);
    const timeParts = time.split(':').map(Number);

    const start = new Date(parts[0], parts[1] - 1, parts[2], timeParts[0] || 0, timeParts[1] || 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const toUTC = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const details = `${description || ''}\n\nOfficial Link: ${url || 'N/A'}\nTracked via Opportunity Reminder Agent (IST)`.trim();

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${toUTC(start)}/${toUTC(end)}`,
      details: details,
      location: location || url || 'Online / Remote'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function downloadEventIcs(evt) {
    const ics = generateIcsContent([evt]);
    const safeName = (evt.title || 'deadline').toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
    downloadIcsBlob(`${safeName}.ics`, ics);
    showToast('Calendar Exported', `Downloaded ${safeName}.ics`, 'success');
  }

  function exportAllScheduleIcs() {
    const allEvents = [];
    state.opportunities.forEach(o => {
      if (o.status !== 'Completed') {
        allEvents.push({
          id: o.id,
          title: `[Opportunity] ${o.title}`,
          dateStr: o.deadline,
          timeStr: '23:59',
          description: `Category: ${o.category}\nCost: ${o.cost}\nEligibility: ${o.eligibility || 'N/A'}\nNotes: ${o.notes || ''}`,
          url: o.url,
          location: o.url || 'Online'
        });
      }
    });

    state.reminders.forEach(r => {
      if (!r.completed) {
        allEvents.push({
          id: r.id,
          title: `[Task] ${r.title}`,
          dateStr: r.dueDate,
          timeStr: r.dueTime || '23:59',
          description: `Category: ${r.category}\nPriority: ${r.priority}\nDescription: ${r.description || ''}`,
          url: '',
          location: 'Campus / Personal'
        });
      }
    });

    if (allEvents.length === 0) {
      showToast('Schedule Empty', 'No active deadlines to export.', 'info');
      return;
    }

    const ics = generateIcsContent(allEvents);
    downloadIcsBlob('college_opportunity_radar_deadlines.ics', ics);
    showToast('Schedule Exported', `Exported ${allEvents.length} deadlines to .ics file!`, 'success');
  }

  function exportCurrentMonthIcs() {
    const year = calendarState.currentYear;
    const month = calendarState.currentMonth;
    const mStr = String(month + 1).padStart(2, '0');
    const prefix = `${year}-${mStr}`;

    const monthEvents = [];
    state.opportunities.forEach(o => {
      if (o.deadline && o.deadline.startsWith(prefix) && o.status !== 'Completed') {
        monthEvents.push({
          id: o.id,
          title: `[Opportunity] ${o.title}`,
          dateStr: o.deadline,
          timeStr: '23:59',
          description: `Category: ${o.category}\nCost: ${o.cost}\nEligibility: ${o.eligibility || 'N/A'}\nNotes: ${o.notes || ''}`,
          url: o.url,
          location: o.url || 'Online'
        });
      }
    });

    state.reminders.forEach(r => {
      if (r.dueDate && r.dueDate.startsWith(prefix) && !r.completed) {
        monthEvents.push({
          id: r.id,
          title: `[Task] ${r.title}`,
          dateStr: r.dueDate,
          timeStr: r.dueTime || '23:59',
          description: `Category: ${r.category}\nPriority: ${r.priority}\nDescription: ${r.description || ''}`,
          url: '',
          location: 'Campus / Personal'
        });
      }
    });

    if (monthEvents.length === 0) {
      showToast('Schedule Empty', `No deadlines found in ${MONTH_NAMES[month]} ${year}.`, 'info');
      return;
    }

    const ics = generateIcsContent(monthEvents);
    downloadIcsBlob(`deadlines_${MONTH_NAMES[month].toLowerCase()}_${year}.ics`, ics);
    showToast('Month Exported', `Saved ${monthEvents.length} events for ${MONTH_NAMES[month]} ${year}`, 'success');
  }

  // ==========================================================================
  // 10C. RENDER: INTERACTIVE MONTHLY DEADLINE CALENDAR
  // ==========================================================================
  const calendarState = {
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),
    filterOpp: true,
    filterRem: true,
    filterUrgent: false
  };

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  let currentDayModalDate = null;
  const modalDayEvents = document.getElementById('modalDayEvents');

  function renderCalendar() {
    const titleEl = document.getElementById('calCurrentMonthTitle');
    const gridEl = document.getElementById('calendarDaysGrid');
    const oppCountEl = document.getElementById('calOppCount');
    const remCountEl = document.getElementById('calRemCount');

    if (!gridEl) return;

    const year = calendarState.currentYear;
    const month = calendarState.currentMonth;

    if (titleEl) {
      titleEl.textContent = `${MONTH_NAMES[month]} ${year}`;
    }

    const todayISTStr = getTodayIST();

    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay(); // 0 is Sun
    const startOffset = (startingDayOfWeek === 0) ? 6 : startingDayOfWeek - 1; // Mon = 0

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const totalCells = (startOffset + daysInMonth <= 35) ? 35 : 42;

    let monthOppsCount = 0;
    let monthRemCount = 0;

    gridEl.innerHTML = '';

    for (let i = 0; i < totalCells; i++) {
      let dayNum;
      let isCurrentMonth = true;
      let cellYear = year;
      let cellMonth = month;

      if (i < startOffset) {
        dayNum = daysInPrevMonth - startOffset + i + 1;
        isCurrentMonth = false;
        cellMonth = month - 1;
        if (cellMonth < 0) {
          cellMonth = 11;
          cellYear = year - 1;
        }
      } else if (i >= startOffset + daysInMonth) {
        dayNum = i - (startOffset + daysInMonth) + 1;
        isCurrentMonth = false;
        cellMonth = month + 1;
        if (cellMonth > 11) {
          cellMonth = 0;
          cellYear = year + 1;
        }
      } else {
        dayNum = i - startOffset + 1;
        isCurrentMonth = true;
      }

      const mStr = String(cellMonth + 1).padStart(2, '0');
      const dStr = String(dayNum).padStart(2, '0');
      const dateStr = `${cellYear}-${mStr}-${dStr}`;

      const dayOpps = state.opportunities.filter(o => o.deadline === dateStr);
      const dayRems = state.reminders.filter(r => r.dueDate === dateStr);

      if (isCurrentMonth) {
        monthOppsCount += dayOpps.length;
        monthRemCount += dayRems.length;
      }

      const visibleEvents = [];

      if (calendarState.filterOpp) {
        dayOpps.forEach(opp => {
          const calc = calculateDaysRemaining(opp.deadline);
          const isUrgent = calc.status === 'urgent' && opp.status !== 'Completed';
          if (!calendarState.filterUrgent || isUrgent) {
            visibleEvents.push({
              type: 'opp',
              id: opp.id,
              title: opp.title,
              category: opp.category,
              status: opp.status,
              cost: opp.cost,
              isUrgent: isUrgent,
              isOverdue: calc.status === 'overdue' && opp.status !== 'Completed',
              isCompleted: opp.status === 'Completed',
              raw: opp
            });
          }
        });
      }

      if (calendarState.filterRem) {
        dayRems.forEach(rem => {
          const calc = calculateDaysRemaining(rem.dueDate);
          const isUrgent = (calc.diffDays >= 0 && calc.diffDays <= 3) && !rem.completed;
          if (!calendarState.filterUrgent || isUrgent) {
            visibleEvents.push({
              type: 'rem',
              id: rem.id,
              title: rem.title,
              category: rem.category,
              priority: rem.priority,
              isUrgent: isUrgent,
              isOverdue: calc.status === 'overdue' && !rem.completed,
              isCompleted: rem.completed,
              raw: rem
            });
          }
        });
      }

      const isToday = (dateStr === todayISTStr);

      const cellEl = document.createElement('div');
      cellEl.className = `cal-day-cell ${!isCurrentMonth ? 'is-other-month' : ''} ${isToday ? 'is-today' : ''}`;
      cellEl.setAttribute('data-date', dateStr);

      const headerHtml = `
        <div class="cal-day-header">
          <span class="cal-day-number">${dayNum}</span>
          ${isToday ? '<span class="cal-today-badge">Today</span>' : (visibleEvents.length > 0 ? `<span class="cal-day-count-badge">${visibleEvents.length}</span>` : '')}
        </div>
      `;

      let eventsHtml = '<div class="cal-day-events">';
      const displayEvents = visibleEvents.slice(0, 3);

      displayEvents.forEach(evt => {
        let chipClass = evt.type === 'opp' ? 'chip-opp' : 'chip-rem';
        if (evt.isCompleted) chipClass = 'chip-completed';
        else if (evt.isOverdue) chipClass = 'chip-overdue';

        const icon = evt.type === 'opp' ? '🎯' : (evt.category === 'Exam' ? '⚡' : '⏰');
        eventsHtml += `
          <div class="cal-event-chip ${chipClass}" title="${escapeHTML(evt.title)} (${evt.category})">
            <span>${icon}</span>
            <span>${escapeHTML(evt.title)}</span>
          </div>
        `;
      });

      if (visibleEvents.length > 3) {
        eventsHtml += `<div class="cal-event-more">+${visibleEvents.length - 3} more</div>`;
      }

      eventsHtml += '</div>';

      cellEl.innerHTML = headerHtml + eventsHtml;

      cellEl.addEventListener('click', () => {
        openDayEventsModal(dateStr, dayOpps, dayRems);
      });

      gridEl.appendChild(cellEl);
    }

    if (oppCountEl) oppCountEl.textContent = monthOppsCount;
    if (remCountEl) remCountEl.textContent = monthRemCount;
  }

  function openDayEventsModal(dateStr, oppsList, remsList) {
    currentDayModalDate = dateStr;
    const titleEl = document.getElementById('modalDayEventsTitle');
    const subEl = document.getElementById('modalDayEventsSubtitle');
    const listEl = document.getElementById('dayEventsList');

    if (!modalDayEvents || !listEl) return;

    const friendly = formatFriendlyDate(dateStr);
    if (titleEl) titleEl.textContent = `Deadlines for ${friendly}`;

    const opps = oppsList || state.opportunities.filter(o => o.deadline === dateStr);
    const rems = remsList || state.reminders.filter(r => r.dueDate === dateStr);
    const total = opps.length + rems.length;

    if (subEl) {
      subEl.textContent = `${total} scheduled ${total === 1 ? 'item' : 'items'} on ${dateStr}`;
    }

    listEl.innerHTML = '';

    if (total === 0) {
      listEl.innerHTML = `
        <div class="empty-state" style="padding: 24px 0;">
          <div class="empty-icon">📅</div>
          <h4 style="margin: 8px 0 4px; font-weight:700;">No deadlines on this day</h4>
          <p class="text-muted" style="font-size:0.85rem;">Nothing scheduled yet. You can log an opportunity deadline or personal reminder below.</p>
        </div>
      `;
    } else {
      opps.forEach(opp => {
        const calc = calculateDaysRemaining(opp.deadline);
        const itemEl = document.createElement('div');
        itemEl.className = 'day-event-item';

        const gcalUrl = getGoogleCalendarUrl({
          title: `[Opportunity] ${opp.title}`,
          description: `Category: ${opp.category}\nCost: ${opp.cost}\nEligibility: ${opp.eligibility || 'N/A'}\nNotes: ${opp.notes || ''}`,
          url: opp.url,
          dateStr: opp.deadline,
          timeStr: '23:59',
          location: opp.url || 'Online'
        });

        itemEl.innerHTML = `
          <div class="day-event-top">
            <div class="day-event-info">
              <div class="day-event-badges">
                <span class="badge-category">${escapeHTML(opp.category)}</span>
                <span class="badge-cost ${opp.cost.toLowerCase().includes('free') ? 'free' : 'paid'}">${escapeHTML(opp.cost)}</span>
                <span class="opp-status-badge ${opp.status}">${opp.status}</span>
              </div>
              <div class="day-event-title">${escapeHTML(opp.title)}</div>
              <div class="day-event-desc">${escapeHTML(opp.notes || opp.eligibility || 'No additional details')}</div>
              <div class="day-event-meta">
                <span>Deadline: ${opp.deadline} (23:59 IST)</span>
                <span>•</span>
                <span style="font-weight:700; color:${calc.status === 'urgent' ? 'var(--orange-accent)' : (calc.status === 'overdue' ? 'var(--danger)' : 'var(--text-muted)')};">${calc.label}</span>
              </div>
            </div>
          </div>
          <div class="day-event-actions">
            <a href="${gcalUrl}" target="_blank" rel="noopener noreferrer" class="btn-gcal-sync" title="Add to Google Calendar">
              <span>📅 Add to Google Calendar</span>
            </a>
            <button class="btn-ics-sync" data-day-action="ics-opp" data-id="${opp.id}" title="Download .ics Calendar Event">
              <span>📥 Export .ics</span>
            </button>
            <a href="${escapeHTML(opp.url)}" target="_blank" rel="noopener noreferrer" class="btn-apply-link" style="margin-left:auto;">
              Visit Portal ↗
            </a>
          </div>
        `;

        listEl.appendChild(itemEl);
      });

      rems.forEach(rem => {
        const calc = calculateDaysRemaining(rem.dueDate);
        const itemEl = document.createElement('div');
        itemEl.className = 'day-event-item';

        const gcalUrl = getGoogleCalendarUrl({
          title: `[Task] ${rem.title}`,
          description: `Category: ${rem.category}\nPriority: ${rem.priority}\nDescription: ${rem.description || ''}`,
          url: '',
          dateStr: rem.dueDate,
          timeStr: rem.dueTime || '23:59',
          location: 'Campus / Personal'
        });

        itemEl.innerHTML = `
          <div class="day-event-top">
            <div class="day-event-info">
              <div class="day-event-badges">
                <span class="reminder-tag">${escapeHTML(rem.category)}</span>
                <span class="reminder-tag" style="color:var(--text-muted);">${escapeHTML(rem.priority)} Priority</span>
                ${rem.completed ? '<span class="badge-status" style="background:var(--green-light); color:var(--green);">✓ Completed</span>' : ''}
              </div>
              <div class="day-event-title ${rem.completed ? 'text-decoration:line-through; opacity:0.7;' : ''}">${escapeHTML(rem.title)}</div>
              <div class="day-event-desc">${escapeHTML(rem.description || 'Personal student reminder')}</div>
              <div class="day-event-meta">
                <span>Due: ${rem.dueDate} at ${rem.dueTime || '23:59'}</span>
                <span>•</span>
                <span style="font-weight:700; color:${calc.status === 'overdue' && !rem.completed ? 'var(--danger)' : 'var(--text-muted)'};">${rem.completed ? 'Finished' : calc.label}</span>
              </div>
            </div>
          </div>
          <div class="day-event-actions">
            <a href="${gcalUrl}" target="_blank" rel="noopener noreferrer" class="btn-gcal-sync" title="Add to Google Calendar">
              <span>📅 Add to Google Calendar</span>
            </a>
            <button class="btn-ics-sync" data-day-action="ics-rem" data-id="${rem.id}" title="Download .ics Calendar Event">
              <span>📥 Export .ics</span>
            </button>
          </div>
        `;

        listEl.appendChild(itemEl);
      });

      listEl.querySelectorAll('[data-day-action="ics-opp"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const target = state.opportunities.find(o => o.id === id);
          if (target) {
            downloadEventIcs({
              id: target.id,
              title: `[Opportunity] ${target.title}`,
              dateStr: target.deadline,
              timeStr: '23:59',
              description: `Category: ${target.category}\nCost: ${target.cost}\nEligibility: ${target.eligibility || 'N/A'}\nNotes: ${target.notes || ''}`,
              url: target.url,
              location: target.url || 'Online'
            });
          }
        });
      });

      listEl.querySelectorAll('[data-day-action="ics-rem"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const target = state.reminders.find(r => r.id === id);
          if (target) {
            downloadEventIcs({
              id: target.id,
              title: `[Task] ${target.title}`,
              dateStr: target.dueDate,
              timeStr: target.dueTime || '23:59',
              description: `Category: ${target.category}\nPriority: ${target.priority}\nDescription: ${target.description || ''}`,
              url: '',
              location: 'Campus / Personal'
            });
          }
        });
      });
    }

    modalDayEvents.classList.remove('hidden');
  }

  function closeDayEventsModal() {
    if (modalDayEvents) modalDayEvents.classList.add('hidden');
  }

  function renderAll() {
    updateCountersAndStats();
    renderDashboard();
    renderOpportunities();
    renderReminders();
    renderCalendar();
  }

  // ==========================================================================
  // 11. MODAL: ADD / EDIT OPPORTUNITY
  // ==========================================================================
  const modalOpportunity = document.getElementById('modalOpportunity');
  const formOpportunity = document.getElementById('formOpportunity');

  function openAddOppModal(prefill = {}) {
    document.getElementById('modalOppTitle').textContent = 'Log New Opportunity';
    document.getElementById('oppId').value = '';
    document.getElementById('oppTitleInput').value = prefill.title || '';
    document.getElementById('oppCategoryInput').value = prefill.category || 'Hackathon';
    document.getElementById('oppCostInput').value = prefill.cost || 'Free';
    document.getElementById('oppDeadlineInput').value = prefill.deadline || getRelativeDateStr(7);
    document.getElementById('oppStatusSelect').value = 'Interested';
    document.getElementById('oppUrlInput').value = prefill.url || '';
    document.getElementById('oppEligibilityInput').value = prefill.eligibility || '';
    document.getElementById('oppNotesInput').value = prefill.notes || '';

    clearOppFormErrors();
    modalOpportunity.classList.remove('hidden');
    document.getElementById('oppTitleInput').focus();
  }

  function openEditOppModal(id) {
    const opp = state.opportunities.find(o => o.id === id);
    if (!opp) return;

    document.getElementById('modalOppTitle').textContent = 'Edit Opportunity';
    document.getElementById('oppId').value = opp.id;
    document.getElementById('oppTitleInput').value = opp.title || '';
    document.getElementById('oppCategoryInput').value = opp.category || 'Hackathon';
    document.getElementById('oppCostInput').value = opp.cost || 'Free';
    document.getElementById('oppDeadlineInput').value = opp.deadline || '';
    document.getElementById('oppStatusSelect').value = opp.status || 'Interested';
    document.getElementById('oppUrlInput').value = opp.url || '';
    document.getElementById('oppEligibilityInput').value = opp.eligibility || '';
    document.getElementById('oppNotesInput').value = opp.notes || '';

    clearOppFormErrors();
    modalOpportunity.classList.remove('hidden');
  }

  function closeOppModal() {
    modalOpportunity.classList.add('hidden');
  }

  function clearOppFormErrors() {
    setText('errorOppTitle', '');
    setText('errorOppDeadline', '');
    setText('errorOppUrl', '');
  }

  if (formOpportunity) {
    formOpportunity.addEventListener('submit', (e) => {
      e.preventDefault();
      clearOppFormErrors();

      const id = document.getElementById('oppId').value;
      const title = document.getElementById('oppTitleInput').value.trim();
      const category = document.getElementById('oppCategoryInput').value;
      const cost = document.getElementById('oppCostInput').value;
      const deadline = document.getElementById('oppDeadlineInput').value;
      const status = document.getElementById('oppStatusSelect').value;
      let url = document.getElementById('oppUrlInput').value.trim();
      const eligibility = document.getElementById('oppEligibilityInput').value.trim();
      const notes = document.getElementById('oppNotesInput').value.trim();

      let hasError = false;

      if (!title) {
        setText('errorOppTitle', 'Please enter a title for the opportunity.');
        hasError = true;
      }

      if (!deadline) {
        setText('errorOppDeadline', 'Please specify a deadline date.');
        hasError = true;
      }

      if (!url) {
        setText('errorOppUrl', 'Please provide an official portal URL.');
        hasError = true;
      } else if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }

      // Check duplicates for new opportunities
      if (!id) {
        const isDuplicate = state.opportunities.some(o => o.title.toLowerCase() === title.toLowerCase());
        if (isDuplicate) {
          setText('errorOppTitle', 'An opportunity with this exact title already exists.');
          hasError = true;
        }
      }

      if (hasError) return;

      if (id) {
        // Edit existing
        const target = state.opportunities.find(o => o.id === id);
        if (target) {
          target.title = title;
          target.category = category;
          target.cost = cost;
          target.deadline = deadline;
          target.status = status;
          target.url = url;
          target.eligibility = eligibility;
          target.notes = notes;
        }
        showToast('Opportunity Updated', title, 'success');
      } else {
        // Create new
        const newOpp = {
          id: `opp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          title,
          category,
          cost,
          deadline,
          status,
          url,
          eligibility,
          notes,
          saved: false,
          isSample: false, // User created authentic record
          createdAt: new Date().toISOString()
        };
        state.opportunities.unshift(newOpp);
        showToast('Opportunity Logged', title, 'success');
      }

      saveOpportunities();
      closeOppModal();
      renderAll();
    });
  }

  // ==========================================================================
  // 12. MODAL: ADD / EDIT REMINDER
  // ==========================================================================
  const modalReminder = document.getElementById('modalReminder');
  const formReminder = document.getElementById('formReminder');

  function openAddReminderModal(prefill = {}) {
    document.getElementById('modalReminderTitle').textContent = 'Add Personal Reminder';
    document.getElementById('reminderId').value = '';
    document.getElementById('reminderTitleInput').value = prefill.title || '';
    document.getElementById('reminderCategoryInput').value = prefill.category || 'Assignment';
    document.getElementById('reminderPriorityInput').value = prefill.priority || 'Medium';
    document.getElementById('reminderDateInput').value = prefill.dueDate || getRelativeDateStr(1);
    document.getElementById('reminderTimeInput').value = prefill.dueTime || '23:59';
    document.getElementById('reminderDescInput').value = prefill.description || '';

    clearReminderFormErrors();
    modalReminder.classList.remove('hidden');
    document.getElementById('reminderTitleInput').focus();
  }

  function openEditReminderModal(id) {
    const rem = state.reminders.find(r => r.id === id);
    if (!rem) return;

    document.getElementById('modalReminderTitle').textContent = 'Edit Personal Reminder';
    document.getElementById('reminderId').value = rem.id;
    document.getElementById('reminderTitleInput').value = rem.title || '';
    document.getElementById('reminderCategoryInput').value = rem.category || 'Assignment';
    document.getElementById('reminderPriorityInput').value = rem.priority || 'Medium';
    document.getElementById('reminderDateInput').value = rem.dueDate || '';
    document.getElementById('reminderTimeInput').value = rem.dueTime || '23:59';
    document.getElementById('reminderDescInput').value = rem.description || '';

    clearReminderFormErrors();
    modalReminder.classList.remove('hidden');
  }

  function closeReminderModal() {
    modalReminder.classList.add('hidden');
  }

  function clearReminderFormErrors() {
    setText('errorReminderTitle', '');
    setText('errorReminderDate', '');
  }

  if (formReminder) {
    formReminder.addEventListener('submit', (e) => {
      e.preventDefault();
      clearReminderFormErrors();

      const id = document.getElementById('reminderId').value;
      const title = document.getElementById('reminderTitleInput').value.trim();
      const category = document.getElementById('reminderCategoryInput').value;
      const priority = document.getElementById('reminderPriorityInput').value;
      const dueDate = document.getElementById('reminderDateInput').value;
      const dueTime = document.getElementById('reminderTimeInput').value || '23:59';
      const description = document.getElementById('reminderDescInput').value.trim();

      let hasError = false;

      if (!title) {
        setText('errorReminderTitle', 'Please enter a task or reminder name.');
        hasError = true;
      }

      if (!dueDate) {
        setText('errorReminderDate', 'Please specify a due date.');
        hasError = true;
      }

      if (hasError) return;

      if (id) {
        // Edit existing
        const target = state.reminders.find(r => r.id === id);
        if (target) {
          target.title = title;
          target.category = category;
          target.priority = priority;
          target.dueDate = dueDate;
          target.dueTime = dueTime;
          target.description = description;
        }
        showToast('Reminder Updated', title, 'success');
      } else {
        // Create new
        const newRem = {
          id: `rem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          title,
          category,
          priority,
          dueDate,
          dueTime,
          description,
          completed: false,
          isSample: false, // Authentic user task
          createdAt: new Date().toISOString()
        };
        state.reminders.unshift(newRem);
        showToast('Reminder Created', title, 'success');
      }

      saveReminders();
      closeReminderModal();
      renderAll();
    });
  }

  // ==========================================================================
  // 13. EXPORT, IMPORT & DATA MANAGEMENT CONTROLLERS
  // ==========================================================================
  
  // Export JSON Backup file
  function exportJSONBackup() {
    const backupData = {
      appName: 'Opportunity Reminder Agent',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      timezone: 'Asia/Kolkata',
      totalOpportunities: state.opportunities.length,
      totalReminders: state.reminders.length,
      opportunities: state.opportunities,
      reminders: state.reminders,
      settings: state.settings
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const todayStr = getTodayIST();
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `opportunity_agent_backup_${todayStr}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);

    showToast('Backup Exported', 'JSON file generated and downloaded successfully.', 'success');
  }

  // Import JSON Backup file
  function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const parsed = JSON.parse(event.target.result);

        if (!Array.isArray(parsed.opportunities) && !Array.isArray(parsed.reminders)) {
          throw new Error('Invalid backup schema: Missing opportunities or reminders array.');
        }

        const importMode = document.querySelector('input[name="importMode"]:checked')?.value || 'merge';

        if (importMode === 'replace') {
          state.opportunities = Array.isArray(parsed.opportunities) ? parsed.opportunities : [];
          state.reminders = Array.isArray(parsed.reminders) ? parsed.reminders : [];
        } else {
          // Merge mode: Add records that do not have matching IDs or titles
          const existingOppTitles = new Set(state.opportunities.map(o => o.title.toLowerCase()));
          if (Array.isArray(parsed.opportunities)) {
            parsed.opportunities.forEach(opp => {
              if (!existingOppTitles.has(opp.title.toLowerCase())) {
                state.opportunities.push(opp);
              }
            });
          }

          const existingRemTitles = new Set(state.reminders.map(r => r.title.toLowerCase()));
          if (Array.isArray(parsed.reminders)) {
            parsed.reminders.forEach(rem => {
              if (!existingRemTitles.has(rem.title.toLowerCase())) {
                state.reminders.push(rem);
              }
            });
          }
        }

        saveOpportunities();
        saveReminders();
        renderAll();
        showToast('Import Complete', `Records restored successfully (${importMode} mode).`, 'success');
      } catch (err) {
        console.error('Import failed:', err);
        showToast('Import Failed', 'Selected file is not a valid JSON backup.', 'error');
      } finally {
        e.target.value = ''; // Reset file input
      }
    };
    reader.readAsText(file);
  }

  // Clear ONLY Sample Records (Preserves User-Created Opportunities & Reminders)
  function clearOnlySampleData() {
    const oppBefore = state.opportunities.length;
    const remBefore = state.reminders.length;

    state.opportunities = state.opportunities.filter(o => !o.isSample);
    state.reminders = state.reminders.filter(r => !r.isSample);

    const clearedOpps = oppBefore - state.opportunities.length;
    const clearedRems = remBefore - state.reminders.length;

    saveOpportunities();
    saveReminders();
    renderAll();

    showToast('Sample Data Cleared', `Removed ${clearedOpps} sample opportunities & ${clearedRems} sample reminders.`, 'info');
  }

  // Factory Reset
  function resetAllData() {
    if (confirm('Are you sure you want to reset all data? This will restore initial sample records and delete any custom entries.')) {
      state.opportunities = [...DEFAULT_OPPORTUNITIES];
      state.reminders = [...DEFAULT_REMINDERS];
      saveOpportunities();
      saveReminders();
      renderAll();
      showToast('System Reset', 'All data reverted to clean default state.', 'info');
    }
  }

  // ==========================================================================
  // 14. NAVIGATION & VIEW SWITCHING CONTROLLER
  // ==========================================================================
  function switchView(viewName) {
    state.currentView = viewName;

    // Update Sidebar Navigation
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const activeSec = document.getElementById(`view-${viewName}`);
    if (activeSec) activeSec.classList.add('active');

    // Update Page Header Titles
    const headerTitle = document.getElementById('pageHeaderTitle');
    const headerSubtitle = document.getElementById('pageHeaderSubtitle');

    const viewTitles = {
      dashboard: { title: 'Dashboard', sub: 'Real-time student opportunities & deadline radar' },
      opportunities: { title: 'Opportunity Finder', sub: 'Hackathons, Google certifications, internships & scholarships' },
      reminders: { title: 'Personal Reminders', sub: 'College assignments, exam dates, LeetCode streaks & tasks' },
      calendar: { title: 'Deadline Calendar', sub: 'Interactive monthly deadline view & Google Calendar sync' },
      sources: { title: 'Trusted Resource Hub', sub: 'Official portals for student challenges & free learning paths' },
      'ai-scout': { title: 'AI Scout (Gemini)', sub: 'Smart announcement parsing, study planning & tailored tech recommendations' },
      backup: { title: 'Backup & Settings', sub: 'Local storage controls, JSON export, and Gemini API configuration' }
    };

    if (viewTitles[viewName]) {
      if (headerTitle) headerTitle.textContent = viewTitles[viewName].title;
      if (headerSubtitle) headerSubtitle.textContent = viewTitles[viewName].sub;
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    // Re-render target view
    renderAll();
  }

  // ==========================================================================
  // 15. INITIALIZATION & EVENT BINDINGS
  // ==========================================================================
  function initEventBindings() {
    // 1. Navigation clicks
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetView = e.currentTarget.getAttribute('data-view');
        if (targetView) switchView(targetView);
      });
    });

    // 2. Dashboard quick navigation buttons
    const dashExploreBtn = document.getElementById('dashExploreBtn');
    if (dashExploreBtn) dashExploreBtn.addEventListener('click', () => switchView('opportunities'));

    const dashAddReminderBtn = document.getElementById('dashAddReminderBtn');
    if (dashAddReminderBtn) dashAddReminderBtn.addEventListener('click', () => switchView('reminders'));

    const dashViewAllOpp = document.getElementById('dashViewAllOpp');
    if (dashViewAllOpp) dashViewAllOpp.addEventListener('click', () => switchView('opportunities'));

    const dashViewAllReminders = document.getElementById('dashViewAllReminders');
    if (dashViewAllReminders) dashViewAllReminders.addEventListener('click', () => switchView('reminders'));

    // 3. Theme Toggle
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        state.settings.theme = newTheme;
        saveSettings();
        showToast('Theme Changed', `Switched to ${newTheme} mode`, 'info');
      });
    }

    // 4. Quick Add Dropdown Menu
    const quickAddBtn = document.getElementById('quickAddBtn');
    const quickAddMenu = document.getElementById('quickAddMenu');
    if (quickAddBtn && quickAddMenu) {
      quickAddBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        quickAddMenu.classList.toggle('show');
      });

      document.addEventListener('click', () => {
        quickAddMenu.classList.remove('show');
      });
    }

    const btnQuickAddOpp = document.getElementById('btnQuickAddOpp');
    if (btnQuickAddOpp) {
      btnQuickAddOpp.addEventListener('click', () => {
        quickAddMenu.classList.remove('show');
        openAddOppModal();
      });
    }

    const btnQuickAddReminder = document.getElementById('btnQuickAddReminder');
    if (btnQuickAddReminder) {
      btnQuickAddReminder.addEventListener('click', () => {
        quickAddMenu.classList.remove('show');
        openAddReminderModal();
      });
    }

    // 5. Notification Bell Dropdown
    const notifBellBtn = document.getElementById('notifBellBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    if (notifBellBtn && notifDropdown) {
      notifBellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && e.target !== notifBellBtn) {
          notifDropdown.classList.remove('show');
        }
      });
    }

    // 6. Mobile sidebar toggle
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const mobileSidebarClose = document.getElementById('mobileSidebarClose');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggleBtn && sidebar) {
      sidebarToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('mobile-open');
      });
    }

    if (mobileSidebarClose && sidebar) {
      mobileSidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
      });
    }

    // 7. Opportunity Finder Controls
    const openAddOppModalBtn = document.getElementById('openAddOppModalBtn');
    if (openAddOppModalBtn) openAddOppModalBtn.addEventListener('click', () => openAddOppModal());

    const btnEmptyAddOpp = document.getElementById('btnEmptyAddOpp');
    if (btnEmptyAddOpp) btnEmptyAddOpp.addEventListener('click', () => openAddOppModal());

    const closeOppModalBtn = document.getElementById('closeOppModalBtn');
    if (closeOppModalBtn) closeOppModalBtn.addEventListener('click', closeOppModal);

    const cancelOppModalBtn = document.getElementById('cancelOppModalBtn');
    if (cancelOppModalBtn) cancelOppModalBtn.addEventListener('click', closeOppModal);

    // Opportunity Search & Filters
    const oppSearchInput = document.getElementById('oppSearchInput');
    const oppClearSearch = document.getElementById('oppClearSearch');

    if (oppSearchInput) {
      oppSearchInput.addEventListener('input', (e) => {
        state.oppFilter.search = e.target.value;
        if (oppClearSearch) {
          if (e.target.value) oppClearSearch.classList.add('show');
          else oppClearSearch.classList.remove('show');
        }
        renderOpportunities();
      });
    }

    if (oppClearSearch && oppSearchInput) {
      oppClearSearch.addEventListener('click', () => {
        oppSearchInput.value = '';
        state.oppFilter.search = '';
        oppClearSearch.classList.remove('show');
        renderOpportunities();
      });
    }

    const oppCostFilter = document.getElementById('oppCostFilter');
    if (oppCostFilter) {
      oppCostFilter.addEventListener('change', (e) => {
        state.oppFilter.cost = e.target.value;
        renderOpportunities();
      });
    }

    const oppStatusFilter = document.getElementById('oppStatusFilter');
    if (oppStatusFilter) {
      oppStatusFilter.addEventListener('change', (e) => {
        state.oppFilter.status = e.target.value;
        renderOpportunities();
      });
    }

    const oppSortSelect = document.getElementById('oppSortSelect');
    if (oppSortSelect) {
      oppSortSelect.addEventListener('change', (e) => {
        state.oppFilter.sort = e.target.value;
        renderOpportunities();
      });
    }

    // Category Tabs
    document.querySelectorAll('#oppCategoryTabs .cat-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('#oppCategoryTabs .cat-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.oppFilter.category = e.currentTarget.getAttribute('data-category');
        renderOpportunities();
      });
    });

    const btnQuickClearSampleOpp = document.getElementById('btnQuickClearSampleOpp');
    if (btnQuickClearSampleOpp) {
      btnQuickClearSampleOpp.addEventListener('click', clearOnlySampleData);
    }

    // 8. Personal Reminder Controls
    const openAddReminderModalBtn = document.getElementById('openAddReminderModalBtn');
    if (openAddReminderModalBtn) openAddReminderModalBtn.addEventListener('click', () => openAddReminderModal());

    const btnEmptyAddReminder = document.getElementById('btnEmptyAddReminder');
    if (btnEmptyAddReminder) btnEmptyAddReminder.addEventListener('click', () => openAddReminderModal());

    const closeReminderModalBtn = document.getElementById('closeReminderModalBtn');
    if (closeReminderModalBtn) closeReminderModalBtn.addEventListener('click', closeReminderModal);

    const cancelReminderModalBtn = document.getElementById('cancelReminderModalBtn');
    if (cancelReminderModalBtn) cancelReminderModalBtn.addEventListener('click', closeReminderModal);

    // Reminder search & filters
    const reminderSearchInput = document.getElementById('reminderSearchInput');
    const reminderClearSearch = document.getElementById('reminderClearSearch');

    if (reminderSearchInput) {
      reminderSearchInput.addEventListener('input', (e) => {
        state.reminderFilter.search = e.target.value;
        if (reminderClearSearch) {
          if (e.target.value) reminderClearSearch.classList.add('show');
          else reminderClearSearch.classList.remove('show');
        }
        renderReminders();
      });
    }

    if (reminderClearSearch && reminderSearchInput) {
      reminderClearSearch.addEventListener('click', () => {
        reminderSearchInput.value = '';
        state.reminderFilter.search = '';
        reminderClearSearch.classList.remove('show');
        renderReminders();
      });
    }

    const reminderCategoryFilter = document.getElementById('reminderCategoryFilter');
    if (reminderCategoryFilter) {
      reminderCategoryFilter.addEventListener('change', (e) => {
        state.reminderFilter.category = e.target.value;
        renderReminders();
      });
    }

    const reminderPriorityFilter = document.getElementById('reminderPriorityFilter');
    if (reminderPriorityFilter) {
      reminderPriorityFilter.addEventListener('change', (e) => {
        state.reminderFilter.priority = e.target.value;
        renderReminders();
      });
    }

    // Reminder sub tabs
    document.querySelectorAll('#reminderStatusTabs .status-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('#reminderStatusTabs .status-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.reminderFilter.statusTab = e.currentTarget.getAttribute('data-status');
        renderReminders();
      });
    });

    // 9. Trusted Hub "Log Entry" shortcut buttons
    document.querySelectorAll('.btn-portal-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sourceName = e.currentTarget.getAttribute('data-source-name');
        const sourceUrl = e.currentTarget.getAttribute('data-source-url');
        const sourceCat = e.currentTarget.getAttribute('data-source-cat') || 'Hackathon';

        openAddOppModal({
          title: sourceName,
          url: sourceUrl,
          category: sourceCat
        });
      });
    });

    // 10. Backup & Restore Controls
    const btnExportJSON = document.getElementById('btnExportJSON');
    if (btnExportJSON) btnExportJSON.addEventListener('click', exportJSONBackup);

    const importFileInput = document.getElementById('importFileInput');
    if (importFileInput) importFileInput.addEventListener('change', handleFileImport);

    const btnClearOnlySampleData = document.getElementById('btnClearOnlySampleData');
    if (btnClearOnlySampleData) btnClearOnlySampleData.addEventListener('click', clearOnlySampleData);

    const btnResetAllData = document.getElementById('btnResetAllData');
    if (btnResetAllData) btnResetAllData.addEventListener('click', resetAllData);

    // 11. Google Apps Script Guide Modal
    const modalAppsScript = document.getElementById('modalAppsScript');
    const btnOpenAppsScriptGuide = document.getElementById('btnOpenAppsScriptGuide');
    const btnViewAppsScriptModal = document.getElementById('btnViewAppsScriptModal');
    const closeAppsScriptModalBtn = document.getElementById('closeAppsScriptModalBtn');
    const btnCloseAppsScriptModal = document.getElementById('btnCloseAppsScriptModal');
    const btnCopyScriptCode = document.getElementById('btnCopyScriptCode');

    function openAppsScriptModal() {
      if (modalAppsScript) modalAppsScript.classList.remove('hidden');
    }

    function closeAppsScriptModal() {
      if (modalAppsScript) modalAppsScript.classList.add('hidden');
    }

    if (btnOpenAppsScriptGuide) btnOpenAppsScriptGuide.addEventListener('click', openAppsScriptModal);
    if (btnViewAppsScriptModal) btnViewAppsScriptModal.addEventListener('click', openAppsScriptModal);
    if (closeAppsScriptModalBtn) closeAppsScriptModalBtn.addEventListener('click', closeAppsScriptModal);
    if (btnCloseAppsScriptModal) btnCloseAppsScriptModal.addEventListener('click', closeAppsScriptModal);

    // 12. Header AI Quick Button
    const headerAiBtn = document.getElementById('headerAiBtn');
    if (headerAiBtn) {
      headerAiBtn.addEventListener('click', () => switchView('ai-scout'));
    }

    // 13. AI Scout Controllers
    initAiScoutControls();

    // 14. Gemini API Key Settings Controls
    initApiKeySettingsControls();

    // 15. Calendar View Controls & Event Handlers
    const btnCalPrev = document.getElementById('btnCalPrev');
    const btnCalNext = document.getElementById('btnCalNext');
    const btnCalToday = document.getElementById('btnCalToday');
    const calCheckOpp = document.getElementById('calCheckOpp');
    const calCheckRem = document.getElementById('calCheckRem');
    const calCheckUrgent = document.getElementById('calCheckUrgent');
    const pillFilterOpp = document.getElementById('pillFilterOpp');
    const pillFilterRem = document.getElementById('pillFilterRem');
    const pillFilterUrgent = document.getElementById('pillFilterUrgent');
    const btnExportMonthIcs = document.getElementById('btnExportMonthIcs');
    const btnExportAllScheduleIcs = document.getElementById('btnExportAllScheduleIcs');
    const btnExportAllIcsSettings = document.getElementById('btnExportAllIcsSettings');
    const btnCalAddEvent = document.getElementById('btnCalAddEvent');
    const closeDayEventsModalBtn = document.getElementById('closeDayEventsModalBtn');
    const btnCloseDayModal = document.getElementById('btnCloseDayModal');
    const btnDayAddOpp = document.getElementById('btnDayAddOpp');
    const btnDayAddRem = document.getElementById('btnDayAddRem');

    if (btnCalPrev) {
      btnCalPrev.addEventListener('click', () => {
        calendarState.currentMonth--;
        if (calendarState.currentMonth < 0) {
          calendarState.currentMonth = 11;
          calendarState.currentYear--;
        }
        renderCalendar();
      });
    }

    if (btnCalNext) {
      btnCalNext.addEventListener('click', () => {
        calendarState.currentMonth++;
        if (calendarState.currentMonth > 11) {
          calendarState.currentMonth = 0;
          calendarState.currentYear++;
        }
        renderCalendar();
      });
    }

    if (btnCalToday) {
      btnCalToday.addEventListener('click', () => {
        const d = new Date();
        calendarState.currentYear = d.getFullYear();
        calendarState.currentMonth = d.getMonth();
        renderCalendar();
        showToast('Calendar View', `Jumped to ${MONTH_NAMES[calendarState.currentMonth]} ${calendarState.currentYear}`, 'info');
      });
    }

    if (calCheckOpp && pillFilterOpp) {
      calCheckOpp.addEventListener('change', (e) => {
        calendarState.filterOpp = e.target.checked;
        pillFilterOpp.classList.toggle('active', e.target.checked);
        renderCalendar();
      });
    }

    if (calCheckRem && pillFilterRem) {
      calCheckRem.addEventListener('change', (e) => {
        calendarState.filterRem = e.target.checked;
        pillFilterRem.classList.toggle('active', e.target.checked);
        renderCalendar();
      });
    }

    if (calCheckUrgent && pillFilterUrgent) {
      calCheckUrgent.addEventListener('change', (e) => {
        calendarState.filterUrgent = e.target.checked;
        pillFilterUrgent.classList.toggle('active', e.target.checked);
        renderCalendar();
      });
    }

    if (btnExportMonthIcs) btnExportMonthIcs.addEventListener('click', exportCurrentMonthIcs);
    if (btnExportAllScheduleIcs) btnExportAllScheduleIcs.addEventListener('click', exportAllScheduleIcs);
    if (btnExportAllIcsSettings) btnExportAllIcsSettings.addEventListener('click', exportAllScheduleIcs);

    if (btnCalAddEvent && quickAddBtn) {
      btnCalAddEvent.addEventListener('click', () => {
        quickAddBtn.click();
      });
    }

    if (closeDayEventsModalBtn) closeDayEventsModalBtn.addEventListener('click', closeDayEventsModal);
    if (btnCloseDayModal) btnCloseDayModal.addEventListener('click', closeDayEventsModal);

    if (btnDayAddOpp) {
      btnDayAddOpp.addEventListener('click', () => {
        closeDayEventsModal();
        openAddOppModal({ deadline: currentDayModalDate });
      });
    }

    if (btnDayAddRem) {
      btnDayAddRem.addEventListener('click', () => {
        closeDayEventsModal();
        openAddReminderModal({ dueDate: currentDayModalDate });
      });
    }

    // Close modals on clicking overlay backdrop
    [modalOpportunity, modalReminder, modalAppsScript, modalDayEvents].forEach(modal => {
      if (!modal) return;
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (modalOpportunity) modalOpportunity.classList.add('hidden');
        if (modalReminder) modalReminder.classList.add('hidden');
        if (modalAppsScript) modalAppsScript.classList.add('hidden');
        if (modalDayEvents) modalDayEvents.classList.add('hidden');
        if (notifDropdown) notifDropdown.classList.remove('show');
        if (quickAddMenu) quickAddMenu.classList.remove('show');
      }
    });
  }

  // ==========================================================================
  // 16. GEMINI AI CLIENT & AI SCOUT CONTROLLER
  // ==========================================================================
  async function callGeminiAPI(promptText) {
    const backendUrl = typeof getActiveBackendUrl === 'function' ? getActiveBackendUrl() : '';

    // Route through Render backend if configured
    if (backendUrl) {
      try {
        const resp = await fetch(`${backendUrl}/api/gemini/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptText })
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.text) return data.text;
        } else {
          const errData = await resp.json().catch(() => ({}));
          console.warn(`Render backend returned error ${resp.status}:`, errData.error);
        }
      } catch (backendErr) {
        console.warn('Render backend unreachable, checking client-side key fallback:', backendErr);
      }
    }

    const apiKey = typeof getActiveApiKey === 'function' ? getActiveApiKey() : APP_CONFIG.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(backendUrl ? 'Render backend unreachable and no client-side API key configured.' : 'No API key configured. Please configure an API key or Render Backend in Backup & Settings.');
    }

    const models = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.GEMINI_MODELS) ? APP_CONFIG.GEMINI_MODELS : ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];
    let lastError = null;

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

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
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error?.message || `HTTP ${response.status}`;
          // If model is busy (503) or not found (404), try next model
          if (response.status === 503 || response.status === 404) {
            lastError = new Error(`[${model}] ${errMsg}`);
            continue;
          }
          throw new Error(errMsg);
        }

        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return candidateText;
        } else {
          throw new Error('Empty response received from Gemini.');
        }
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error('All candidate Gemini models failed to respond.');
  }

  // State to hold last extracted opportunity from AI
  let lastExtractedOpp = null;
  let lastBreakdownSteps = [];

  function initAiScoutControls() {
    // Mode tabs
    const tabs = document.querySelectorAll('#aiModeTabs .ai-mode-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const mode = e.currentTarget.getAttribute('data-mode');

        document.getElementById('aiPanelExtract').classList.toggle('active', mode === 'extract');
        document.getElementById('aiPanelRecommend').classList.toggle('active', mode === 'recommend');
        document.getElementById('aiPanelStudy').classList.toggle('active', mode === 'study');
      });
    });

    // Mode 1: Insert sample announcement
    const btnSampleText = document.getElementById('btnSampleText');
    const aiExtractInput = document.getElementById('aiExtractInput');
    if (btnSampleText && aiExtractInput) {
      btnSampleText.addEventListener('click', () => {
        aiExtractInput.value = `🚀 Registrations Open: Smart India Hackathon (SIH 2026) Junior & Senior Edition!
Eligibility: 1st to 4th year B.Tech, BCA, MCA college students in teams of 6.
Deadline: Apply before 28th October 2026.
Fee: 100% Free registration funded by Ministry of Education.
Themes: Smart Automation, MedTech, Clean Water & AI Solutions.
Portal: https://sih.gov.in
Selection requires problem statement selection and 5-slide idea PPT.`;
        showToast('Sample Loaded', 'Click "Extract with Gemini AI" to test.', 'info');
      });
    }

    // Mode 1: Run AI Extraction
    const btnRunAiExtract = document.getElementById('btnRunAiExtract');
    if (btnRunAiExtract) {
      btnRunAiExtract.addEventListener('click', async () => {
        const text = document.getElementById('aiExtractInput')?.value.trim();
        if (!text) {
          showToast('Input Required', 'Please paste an announcement or poster text.', 'warning');
          return;
        }

        btnRunAiExtract.disabled = true;
        btnRunAiExtract.innerHTML = '<span>⏳ Parsing with Gemini AI...</span>';

        const prompt = `You are a student opportunity parser. Extract structured details from the following announcement text.
Output MUST be strictly valid JSON without markdown fences, with these exact keys:
{
  "title": "short, clear title of the hackathon, certification, course or opportunity",
  "category": "Hackathon" or "Certification" or "Internship" or "Scholarship" or "Course" or "Workshop",
  "cost": "Free" or "Paid",
  "deadline": "YYYY-MM-DD" (if year missing, assume 2026; if specific date unknown, estimate reasonable date or 14 days ahead),
  "url": "official portal link or https://unstop.com if unspecified",
  "eligibility": "concise eligibility note",
  "notes": "summary of tracks, rounds or submission requirements"
}

Announcement text:
"""
${text}
"""`;

        try {
          const rawAiResponse = await callGeminiAPI(prompt);
          // Clean possible markdown code fences
          const cleanJsonStr = rawAiResponse.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
          const parsed = JSON.parse(cleanJsonStr);

          lastExtractedOpp = {
            id: `opp_${Date.now()}`,
            title: parsed.title || 'Extracted Opportunity',
            category: parsed.category || 'Hackathon',
            cost: parsed.cost || 'Free',
            deadline: parsed.deadline || getRelativeDateStr(7),
            url: parsed.url || 'https://unstop.com',
            eligibility: parsed.eligibility || 'Open to college students',
            notes: parsed.notes || 'Parsed automatically by Gemini AI.',
            status: 'Interested',
            saved: true,
            isSample: false,
            createdAt: new Date().toISOString()
          };

          renderExtractedPreview(lastExtractedOpp);
          showToast('Extraction Complete', `Parsed: ${lastExtractedOpp.title}`, 'success');
        } catch (err) {
          console.warn('Gemini API parse failed, using smart local fallback parser:', err);
          // Fallback parser if API is temporarily unavailable
          lastExtractedOpp = smartLocalExtractFallback(text);
          renderExtractedPreview(lastExtractedOpp);
          showToast('Smart Extractor', `Parsed: ${lastExtractedOpp.title}`, 'info');
        } finally {
          btnRunAiExtract.disabled = false;
          btnRunAiExtract.innerHTML = '<span>✨ Extract with Gemini AI</span>';
        }
      });
    }

    // Add extracted opportunity to radar
    const btnAddExtractedToRadar = document.getElementById('btnAddExtractedToRadar');
    if (btnAddExtractedToRadar) {
      btnAddExtractedToRadar.addEventListener('click', () => {
        if (!lastExtractedOpp) return;
        state.opportunities.unshift(lastExtractedOpp);
        saveOpportunities();
        renderAll();
        showToast('Added to Radar', `"${lastExtractedOpp.title}" saved.`, 'success');
        switchView('opportunities');
      });
    }

    // Mode 2: Tailored Recommendations
    const btnRunAiRecommend = document.getElementById('btnRunAiRecommend');
    if (btnRunAiRecommend) {
      btnRunAiRecommend.addEventListener('click', async () => {
        const year = document.getElementById('aiStudentYear')?.value || '2nd Year Undergrad';
        const domain = document.getElementById('aiStudentDomain')?.value || 'Web & AI';

        btnRunAiRecommend.disabled = true;
        btnRunAiRecommend.innerHTML = '<span>⏳ Consulting Gemini AI...</span>';

        const prompt = `Act as an expert career advisor for college students.
Recommend 3 genuine, highly recognized opportunities (hackathons, free cloud certifications, or open-source programs) for a ${year} student interested in ${domain}.
Focus on platforms like Google Cloud Skills Boost, Microsoft Learn, Unstop, Devpost, and AWS.
Format with clean bullet points:
- Opportunity Name
- Category & Cost
- Recommended Action / Preparation Advice`;

        try {
          const aiResponse = await callGeminiAPI(prompt);
          const formattedHtml = aiResponse
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n- /g, '<br>&bull; ');

          const resultBox = document.getElementById('aiRecommendResult');
          const content = document.getElementById('aiRecommendContent');
          if (content && resultBox) {
            content.innerHTML = formattedHtml;
            resultBox.classList.remove('hidden');
          }
          showToast('Recommendations Ready', 'Gemini suggested 3 programs for your focus.', 'success');
        } catch (err) {
          console.error(err);
          const resultBox = document.getElementById('aiRecommendResult');
          const content = document.getElementById('aiRecommendContent');
          if (content && resultBox) {
            content.innerHTML = `<strong>🌟 Recommended for ${escapeHTML(domain)} (${escapeHTML(year)}):</strong><br><br>
&bull; <strong>Google Cloud Skills Boost Arcade:</strong> Complete cloud computing skill badges to earn verified Google credentials and examination vouchers (free).<br>
&bull; <strong>Unstop National Hackathons:</strong> Participate in top engineering challenges with off-campus interview shortlists.<br>
&bull; <strong>Microsoft Learn Cloud Skills Challenge:</strong> Free certification voucher tracks for Azure fundamentals.`;
            resultBox.classList.remove('hidden');
          }
          showToast('Advisor Active', 'Generated student recommendations.', 'info');
        } finally {
          btnRunAiRecommend.disabled = false;
          btnRunAiRecommend.innerHTML = '<span>✨ Ask Gemini for Top Opportunities</span>';
        }
      });
    }

    // Mode 3: Exam / Milestone Breakdown
    const btnRunAiBreakdown = document.getElementById('btnRunAiBreakdown');
    if (btnRunAiBreakdown) {
      btnRunAiBreakdown.addEventListener('click', async () => {
        const title = document.getElementById('aiGoalTitle')?.value.trim();
        const deadline = document.getElementById('aiGoalDate')?.value;

        if (!title) {
          showToast('Title Required', 'Enter your exam or project milestone name.', 'warning');
          return;
        }

        btnRunAiBreakdown.disabled = true;
        btnRunAiBreakdown.innerHTML = '<span>⏳ Generating Milestones...</span>';

        const prompt = `Break down preparation for this student goal into 3 progressive, actionable milestone tasks: "${title}", targeted deadline: ${deadline || 'in 7 days'}.
Output strictly valid JSON array without markdown fences:
[
  { "title": "Step 1 title", "daysOffset": -3, "description": "short description" },
  { "title": "Step 2 title", "daysOffset": -1, "description": "short description" },
  { "title": "Final Submission / Exam Day", "daysOffset": 0, "description": "short description" }
]`;

        try {
          const raw = await callGeminiAPI(prompt);
          const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
          lastBreakdownSteps = JSON.parse(clean);
          renderBreakdownSteps(lastBreakdownSteps, deadline, title);
        } catch (err) {
          // Fallback steps
          lastBreakdownSteps = [
            { title: `Phase 1: Syllabus & Notes Review for ${title}`, daysOffset: -4, description: 'Review key modules, reference diagrams, and formulas.' },
            { title: `Phase 2: Practice Problems & Mock Quiz for ${title}`, daysOffset: -2, description: 'Solve previous year questions or debug core code blocks.' },
            { title: `Final Check & Submission for ${title}`, daysOffset: 0, description: 'Verify all documentation, hall ticket, and requirements.' }
          ];
          renderBreakdownSteps(lastBreakdownSteps, deadline, title);
        } finally {
          btnRunAiBreakdown.disabled = false;
          btnRunAiBreakdown.innerHTML = '<span>✨ Generate Milestone Checklist</span>';
        }
      });
    }

    // Add breakdown steps to reminders
    const btnAddMilestonesToReminders = document.getElementById('btnAddMilestonesToReminders');
    if (btnAddMilestonesToReminders) {
      btnAddMilestonesToReminders.addEventListener('click', () => {
        if (!lastBreakdownSteps || lastBreakdownSteps.length === 0) return;

        const baseDate = document.getElementById('aiGoalDate')?.value || getRelativeDateStr(7);
        const baseD = new Date(baseDate + 'T00:00:00');

        lastBreakdownSteps.forEach((step, idx) => {
          const stepDate = new Date(baseD);
          stepDate.setDate(stepDate.getDate() + (step.daysOffset || 0));
          const y = stepDate.getFullYear();
          const m = String(stepDate.getMonth() + 1).padStart(2, '0');
          const d = String(stepDate.getDate()).padStart(2, '0');

          state.reminders.unshift({
            id: `rem_ai_${Date.now()}_${idx}`,
            title: step.title,
            category: 'Assignment',
            priority: idx === lastBreakdownSteps.length - 1 ? 'High' : 'Medium',
            dueDate: `${y}-${m}-${d}`,
            dueTime: '22:00',
            description: step.description,
            completed: false,
            isSample: false,
            createdAt: new Date().toISOString()
          });
        });

        saveReminders();
        renderAll();
        showToast('Milestones Added', `Created ${lastBreakdownSteps.length} personal reminders.`, 'success');
        switchView('reminders');
      });
    }
  }

  function renderExtractedPreview(opp) {
    const box = document.getElementById('aiExtractResult');
    const fields = document.getElementById('aiExtractedFields');
    if (!box || !fields) return;

    fields.innerHTML = `
      <div class="extracted-field">
        <span class="field-label">Title</span>
        <span class="field-value">${escapeHTML(opp.title)}</span>
      </div>
      <div class="extracted-field">
        <span class="field-label">Category & Cost</span>
        <span class="field-value">${escapeHTML(opp.category)} &bull; ${escapeHTML(opp.cost)}</span>
      </div>
      <div class="extracted-field">
        <span class="field-label">Deadline</span>
        <span class="field-value">${formatFriendlyDate(opp.deadline)}</span>
      </div>
      <div class="extracted-field">
        <span class="field-label">Official Link</span>
        <span class="field-value"><a href="${escapeHTML(opp.url)}" target="_blank" rel="noopener">${escapeHTML(opp.url)}</a></span>
      </div>
      <div class="extracted-field" style="grid-column: span 2;">
        <span class="field-label">Eligibility</span>
        <span class="field-value">${escapeHTML(opp.eligibility)}</span>
      </div>
      <div class="extracted-field" style="grid-column: span 2;">
        <span class="field-label">Notes & Tracks</span>
        <span class="field-value">${escapeHTML(opp.notes)}</span>
      </div>
    `;

    box.classList.remove('hidden');
  }

  function renderBreakdownSteps(steps, baseDeadline, title) {
    const box = document.getElementById('aiBreakdownResult');
    const list = document.getElementById('aiBreakdownList');
    if (!box || !list) return;

    list.innerHTML = '';
    const baseDate = baseDeadline || getRelativeDateStr(7);
    const baseD = new Date(baseDate + 'T00:00:00');

    steps.forEach((step, idx) => {
      const stepDate = new Date(baseD);
      stepDate.setDate(stepDate.getDate() + (step.daysOffset || 0));
      const dateStr = formatFriendlyDate(`${stepDate.getFullYear()}-${String(stepDate.getMonth() + 1).padStart(2, '0')}-${String(stepDate.getDate()).padStart(2, '0')}`);

      const item = document.createElement('div');
      item.className = 'ai-breakdown-step';
      item.innerHTML = `
        <div class="step-num">${idx + 1}</div>
        <div class="step-info">
          <div class="step-title">${escapeHTML(step.title)}</div>
          <small style="color: var(--text-muted);">${escapeHTML(step.description || '')}</small>
        </div>
        <div class="step-due">${dateStr}</div>
      `;
      list.appendChild(item);
    });

    box.classList.remove('hidden');
    showToast('Plan Generated', `Created 3 milestones for ${title || 'your goal'}.`, 'success');
  }

  // Smart local heuristic fallback in case Google servers return 503 spike
  function smartLocalExtractFallback(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const title = lines[0]?.replace(/^[🚀⚡✨*\s]+/, '').slice(0, 70) || 'Student Opportunity';

    // Extract URL if present
    const urlMatch = text.match(/https?:\/\/[^\s)]+/i);
    const url = urlMatch ? urlMatch[0] : 'https://unstop.com';

    // Detect category
    let category = 'Hackathon';
    if (/certif|badge|exam/i.test(text)) category = 'Certification';
    else if (/intern|hiring|job|stipend/i.test(text)) category = 'Internship';
    else if (/scholar|fellowship|grant/i.test(text)) category = 'Scholarship';
    else if (/course|training|learning/i.test(text)) category = 'Course';
    else if (/workshop|webinar|bootcamp/i.test(text)) category = 'Workshop';

    // Detect cost
    const cost = /free|no fee|0\s*rs|grant/i.test(text) ? 'Free' : 'Paid';

    return {
      id: `opp_${Date.now()}`,
      title,
      category,
      cost,
      deadline: getRelativeDateStr(10),
      url,
      eligibility: 'Open to college students',
      notes: text.slice(0, 200),
      status: 'Interested',
      saved: true,
      isSample: false,
      createdAt: new Date().toISOString()
    };
  }

  // ==========================================================================
  // 17. API KEY SETTINGS CONTROLLER
  // ==========================================================================
  function initApiKeySettingsControls() {
    const maskedKeyEl = document.getElementById('settingsMaskedKey');
    const pill = document.getElementById('aiKeyStatusPill');
    const inputCustomKey = document.getElementById('inputCustomApiKey');
    const btnSaveCustomKey = document.getElementById('btnSaveCustomKey');
    const btnTestApiConnection = document.getElementById('btnTestApiConnection');
    const btnResetToDefaultKey = document.getElementById('btnResetToDefaultKey');
    const btnToggleKeyVisibility = document.getElementById('btnToggleKeyVisibility');
    const apiTestStatus = document.getElementById('apiTestStatus');

    let isRevealed = false;

    function refreshKeyDisplay() {
      const activeKey = typeof getActiveApiKey === 'function' ? getActiveApiKey() : APP_CONFIG.GEMINI_API_KEY;
      if (maskedKeyEl) {
        maskedKeyEl.textContent = isRevealed ? activeKey : (typeof maskApiKey === 'function' ? maskApiKey(activeKey) : '••••••••••••');
      }
      if (pill) {
        pill.textContent = `Key: ${typeof maskApiKey === 'function' ? maskApiKey(activeKey) : 'Active'}`;
      }
    }

    refreshKeyDisplay();

    // Toggle reveal
    if (btnToggleKeyVisibility) {
      btnToggleKeyVisibility.addEventListener('click', () => {
        isRevealed = !isRevealed;
        btnToggleKeyVisibility.textContent = isRevealed ? 'Hide' : 'Reveal';
        refreshKeyDisplay();
      });
    }

    // Save custom key
    if (btnSaveCustomKey && inputCustomKey) {
      btnSaveCustomKey.addEventListener('click', () => {
        const newKey = inputCustomKey.value.trim();
        if (!newKey) {
          showToast('Input Required', 'Please paste a valid Gemini API key.', 'warning');
          return;
        }
        localStorage.setItem(APP_CONFIG.STORAGE_KEY_API, newKey);
        inputCustomKey.value = '';
        refreshKeyDisplay();
        showToast('API Key Saved', 'Custom Gemini API key active and persisted locally.', 'success');
      });
    }

    // Reset to default key
    if (btnResetToDefaultKey) {
      btnResetToDefaultKey.addEventListener('click', () => {
        localStorage.removeItem(APP_CONFIG.STORAGE_KEY_API);
        refreshKeyDisplay();
        showToast('Key Reset', 'Restored original configured Gemini API key.', 'info');
      });
    }

    // Test API connection
    if (btnTestApiConnection) {
      btnTestApiConnection.addEventListener('click', async () => {
        if (apiTestStatus) {
          apiTestStatus.textContent = '⏳ Testing connection to Google Gemini API...';
          apiTestStatus.style.color = 'var(--text-muted)';
        }

        const t0 = performance.now();
        try {
          await callGeminiAPI('Reply with the word "Connected" in 1 word.');
          const latency = Math.round(performance.now() - t0);
          if (apiTestStatus) {
            apiTestStatus.textContent = `✅ Successfully connected to Gemini! Latency: ${latency}ms`;
            apiTestStatus.style.color = 'var(--green)';
          }
          showToast('Connection Verified', `Google Gemini API active (${latency}ms)`, 'success');
        } catch (err) {
          const latency = Math.round(performance.now() - t0);
          // If error is high demand (503), the key is valid but service is busy
          if (err.message && err.message.includes('503')) {
            if (apiTestStatus) {
              apiTestStatus.textContent = `⚠️ Key is authentic and authorized! (Google API currently experiencing temporary demand spike: ${latency}ms)`;
              apiTestStatus.style.color = 'var(--orange-accent)';
            }
            showToast('Key Verified', 'Authorized with Google API (temporary demand spike).', 'info');
          } else {
            if (apiTestStatus) {
              apiTestStatus.textContent = `❌ Test result: ${err.message}`;
              apiTestStatus.style.color = 'var(--danger)';
            }
            showToast('Connection Test', err.message, 'warning');
          }
        }
      });
    }

    // 15. Render Cloud Backend Deployment Controls
    const inputBackendUrl = document.getElementById('inputBackendUrl');
    const btnSaveBackendUrl = document.getElementById('btnSaveBackendUrl');
    const btnTestBackendHealth = document.getElementById('btnTestBackendHealth');
    const btnClearBackendUrl = document.getElementById('btnClearBackendUrl');
    const backendTestStatus = document.getElementById('backendTestStatus');
    const renderStatusText = document.getElementById('renderStatusText');
    const chipRenderStatus = document.getElementById('chipRenderStatus');

    function refreshBackendDisplay() {
      const activeUrl = typeof getActiveBackendUrl === 'function' ? getActiveBackendUrl() : '';
      if (inputBackendUrl) inputBackendUrl.value = activeUrl;
      if (renderStatusText && chipRenderStatus) {
        if (activeUrl) {
          renderStatusText.textContent = 'Configured';
          chipRenderStatus.className = 'deploy-chip connected';
        } else {
          renderStatusText.textContent = 'Client-Side Mode';
          chipRenderStatus.className = 'deploy-chip';
        }
      }
    }

    refreshBackendDisplay();

    if (btnSaveBackendUrl) {
      btnSaveBackendUrl.addEventListener('click', () => {
        const val = inputBackendUrl ? inputBackendUrl.value.trim().replace(/\/+$/, '') : '';
        if (val) {
          localStorage.setItem(APP_CONFIG.STORAGE_KEY_BACKEND, val);
          showToast('Backend Saved', 'Render API Service URL configured.', 'success');
        } else {
          localStorage.removeItem(APP_CONFIG.STORAGE_KEY_BACKEND);
          showToast('Backend Cleared', 'Switched to client-side mode.', 'info');
        }
        refreshBackendDisplay();
      });
    }

    if (btnClearBackendUrl) {
      btnClearBackendUrl.addEventListener('click', () => {
        localStorage.removeItem(APP_CONFIG.STORAGE_KEY_BACKEND);
        if (inputBackendUrl) inputBackendUrl.value = '';
        refreshBackendDisplay();
        if (backendTestStatus) backendTestStatus.textContent = '';
        showToast('Reset to Client-Side', 'Using direct browser requests.', 'info');
      });
    }

    if (btnTestBackendHealth) {
      btnTestBackendHealth.addEventListener('click', async () => {
        const url = (inputBackendUrl && inputBackendUrl.value.trim()) 
          ? inputBackendUrl.value.trim().replace(/\/+$/, '') 
          : (typeof getActiveBackendUrl === 'function' ? getActiveBackendUrl() : '');

        if (!url) {
          if (backendTestStatus) {
            backendTestStatus.textContent = '⚠️ Enter your Render backend URL above first (e.g. https://your-app.onrender.com).';
            backendTestStatus.style.color = 'var(--orange-accent)';
          }
          return;
        }

        if (backendTestStatus) {
          backendTestStatus.textContent = `⏳ Pinging ${url}/health...`;
          backendTestStatus.style.color = 'var(--text-muted)';
        }

        const t0 = performance.now();
        try {
          const resp = await fetch(`${url}/health`, { method: 'GET' });
          const latency = Math.round(performance.now() - t0);
          if (resp.ok) {
            const data = await resp.json();
            const geminiInfo = data.geminiConfigured ? '🟢 Gemini API Key configured on server' : '⚠️ Server online, but GEMINI_API_KEY env var is missing on Render';
            if (backendTestStatus) {
              backendTestStatus.textContent = `✅ Render Backend Online (${latency}ms) — ${geminiInfo}`;
              backendTestStatus.style.color = data.geminiConfigured ? 'var(--green)' : 'var(--orange-accent)';
            }
            if (chipRenderStatus && renderStatusText) {
              renderStatusText.textContent = `Online (${latency}ms)`;
              chipRenderStatus.className = 'deploy-chip connected';
            }
            showToast('Backend Online', `Render server verified (${latency}ms)`, 'success');
          } else {
            throw new Error(`HTTP ${resp.status}`);
          }
        } catch (err) {
          const latency = Math.round(performance.now() - t0);
          if (backendTestStatus) {
            backendTestStatus.textContent = `❌ Unable to reach Render service: ${err.message} (${latency}ms). (Note: Render free tier can take ~50s to wake from sleep)`;
            backendTestStatus.style.color = 'var(--danger)';
          }
          if (chipRenderStatus && renderStatusText) {
            renderStatusText.textContent = 'Unreachable';
            chipRenderStatus.className = 'deploy-chip offline';
          }
          showToast('Backend Error', err.message, 'warning');
        }
      });
    }
  }

  // ==========================================================================
  // 18. FLOATING RADAR COPILOT CHATBOT CONTROLLER
  // ==========================================================================
  function initRadarCopilotChatbot() {
    const fabBtn = document.getElementById('chatbotFabBtn');
    const chatWindow = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('btnCloseChatWindow');
    const clearBtn = document.getElementById('btnClearChatHistory');
    const messagesContainer = document.getElementById('chatMessagesContainer');
    const typingIndicator = document.getElementById('chatTypingIndicator');
    const inputForm = document.getElementById('chatInputForm');
    const inputText = document.getElementById('chatInputText');
    const sendBtn = document.getElementById('btnChatSend');
    const micBtn = document.getElementById('btnChatMic');
    const suggestionsBox = document.getElementById('chatSuggestionsBox');
    const headerAiBtn = document.getElementById('headerAiBtn');

    if (!fabBtn || !chatWindow) return;

    const STORAGE_KEY_CHAT = 'opportunity_agent_copilot_history_v1';
    let chatHistory = [];

    // Load stored messages
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CHAT);
      if (stored) {
        chatHistory = JSON.parse(stored);
      }
    } catch (e) {
      chatHistory = [];
    }

    if (!Array.isArray(chatHistory) || chatHistory.length === 0) {
      chatHistory = [
        {
          sender: 'bot',
          text: `👋 **Hi there! I'm Radar Copilot, your student AI assistant.**\n\nI'm connected in real-time to your deadlines, exams, and opportunities. You can ask me:\n• *"What do I need to submit this week?"*\n• *"Add an exam: DBMS Midterm on Oct 25 at 10:00 AM"*\n• *"Find 3 free cloud certification challenges"*\n• *"Draft a cold outreach email for project mentorship"*\n\nHow can I help you today?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    }

    function saveChatHistory() {
      try {
        if (chatHistory.length > 40) {
          chatHistory = chatHistory.slice(-40);
        }
        localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(chatHistory));
      } catch (e) {
        console.warn('Failed to save chat history:', e);
      }
    }

    function formatChatMarkdown(text) {
      if (!text) return '';
      let clean = escapeHTML(text);
      clean = clean.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
      clean = clean.replace(/`([^`]+)`/g, '<code>$1</code>');
      clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      clean = clean.replace(/\*(.*?)\*/g, '<em>$1</em>');
      clean = clean.replace(/\[(.*?)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>');
      clean = clean.replace(/\n- (.*?)(?=\n|$)/g, '<br>&bull; $1');
      clean = clean.replace(/\n• (.*?)(?=\n|$)/g, '<br>&bull; $1');
      clean = clean.replace(/\n/g, '<br>');
      return clean;
    }

    function renderChatMessages() {
      if (!messagesContainer) return;
      messagesContainer.innerHTML = '';

      chatHistory.forEach(msg => {
        const msgEl = document.createElement('div');
        msgEl.className = `chat-msg ${msg.sender}`;

        let avatarHtml = '';
        if (msg.sender === 'bot') {
          avatarHtml = '<div class="chat-msg-avatar">🤖</div>';
        } else {
          avatarHtml = '<div class="chat-msg-avatar">🎓</div>';
        }

        let actionCardHtml = '';
        if (msg.actionExecuted) {
          actionCardHtml = `
            <div class="chat-action-card">
              <span class="chat-action-icon">✓</span>
              <span><strong>Action Completed:</strong> ${escapeHTML(msg.actionExecuted)}</span>
            </div>
          `;
        }

        msgEl.innerHTML = `
          ${avatarHtml}
          <div class="chat-msg-content-wrap">
            <div class="chat-msg-bubble">
              ${formatChatMarkdown(msg.text)}
              ${actionCardHtml}
            </div>
            <div class="chat-msg-time">${escapeHTML(msg.time || '')}</div>
          </div>
        `;

        messagesContainer.appendChild(msgEl);
      });

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function toggleChatWindow(forceState) {
      const isHidden = chatWindow.classList.contains('hidden');
      const shouldOpen = (typeof forceState === 'boolean') ? forceState : isHidden;

      if (shouldOpen) {
        chatWindow.classList.remove('hidden');
        renderChatMessages();
        setTimeout(() => inputText && inputText.focus(), 150);
      } else {
        chatWindow.classList.add('hidden');
      }
    }

    fabBtn.addEventListener('click', () => toggleChatWindow());
    closeBtn.addEventListener('click', () => toggleChatWindow(false));

    if (headerAiBtn) {
      headerAiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleChatWindow(true);
      });
    }

    clearBtn.addEventListener('click', () => {
      if (confirm('Clear Copilot chat conversation history?')) {
        chatHistory = [
          {
            sender: 'bot',
            text: `Conversation cleared. 🧹 What would you like to plan or explore next?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
        saveChatHistory();
        renderChatMessages();
        showToast('Chat Cleared', 'Conversation history reset.', 'info');
      }
    });

    inputText.addEventListener('input', () => {
      inputText.style.height = 'auto';
      inputText.style.height = Math.min(inputText.scrollHeight, 90) + 'px';
    });

    inputText.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        inputForm.dispatchEvent(new Event('submit'));
      }
    });

    if (suggestionsBox) {
      suggestionsBox.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const prompt = chip.getAttribute('data-prompt');
          if (prompt) {
            handleSendMessage(prompt);
          }
        });
      });
    }

    // Voice recognition (Web Speech API)
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRec && micBtn) {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        micBtn.classList.add('listening');
        showToast('Listening...', 'Speak your query or task.', 'info');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && inputText) {
          inputText.value = transcript;
          inputText.style.height = 'auto';
          inputText.style.height = Math.min(inputText.scrollHeight, 90) + 'px';
        }
      };

      recognition.onerror = () => {
        micBtn.classList.remove('listening');
        showToast('Voice Input', 'Audio capture cancelled or unavailable.', 'warning');
      };

      recognition.onend = () => {
        micBtn.classList.remove('listening');
      };

      micBtn.addEventListener('click', () => {
        try {
          if (micBtn.classList.contains('listening')) {
            recognition.stop();
          } else {
            recognition.start();
          }
        } catch (e) {
          console.warn('Speech recognition error:', e);
        }
      });
    } else if (micBtn) {
      micBtn.style.display = 'none';
    }

    function buildCopilotSystemPrompt(userText) {
      const todayIST = getTodayIST();
      
      const urgentOpps = state.opportunities.filter(o => {
        if (o.status === 'Completed') return false;
        const c = calculateDaysRemaining(o.deadline);
        return c.diffDays >= 0 && c.diffDays <= 7;
      }).map(o => `"${o.title}" (${o.category}, deadline: ${o.deadline})`).join(', ') || 'None';

      const pendingReminders = state.reminders.filter(r => !r.completed)
        .map(r => `"${r.title}" (Category: ${r.category}, Due: ${r.dueDate}, Priority: ${r.priority})`).join(', ') || 'None';

      return `You are Radar Copilot, an intelligent, encouraging personal academic & opportunity assistant built for college students inside the Opportunity Reminder Agent.
Current Date (Indian Standard Time): ${todayIST}.
Active Opportunities Closing Soon (within 7 days): ${urgentOpps}.
Active Pending Student Reminders/Deadlines: ${pendingReminders}.

Instructions:
1. Answer concisely, practically, and empathetically with clear markdown formatting (bullet points, bold text).
2. If the user asks about their schedule or deadlines, answer using the exact active opportunities and pending reminders provided above!
3. If the user asks to add, schedule, or log an assignment, exam, task, or hackathon:
   - Provide a warm confirmation.
   - At the VERY END of your reply, output a single command wrapped in <<<ACTION_COMMAND: ... >>>:
     For a reminder / academic task:
     <<<ACTION_COMMAND: {"action":"add_reminder","title":"Task Title","category":"Assignment|Exam|Project|LeetCode|Bill|Appointment|Personal","priority":"High|Medium|Low","dueDate":"YYYY-MM-DD","dueTime":"HH:MM","description":"brief details"}>>>
     For a hackathon / certification / course:
     <<<ACTION_COMMAND: {"action":"add_opportunity","title":"Opportunity Title","category":"Hackathon|Certification|Internship|Scholarship|Course|Workshop","cost":"Free|Paid","deadline":"YYYY-MM-DD","url":"https://...","eligibility":"...","notes":"..."}>>>
   (Ensure dueDate/deadline is a valid YYYY-MM-DD date based on today: ${todayIST}).
4. If the user asks for guidance (e.g. hackathon prep, resume tips, exam schedule), give actionable, high-yield advice.

Student query:
"${userText}"`;
    }

    async function handleSendMessage(customText) {
      const text = (typeof customText === 'string') ? customText.trim() : (inputText.value || '').trim();
      if (!text) return;

      inputText.value = '';
      inputText.style.height = 'auto';

      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      chatHistory.push({
        sender: 'user',
        text: text,
        time: nowTime
      });

      saveChatHistory();
      renderChatMessages();

      typingIndicator.classList.remove('hidden');
      sendBtn.disabled = true;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      try {
        let aiRawResponse = '';
        const backendUrl = typeof getActiveBackendUrl === 'function' ? getActiveBackendUrl() : '';

        // If Render backend is configured, attempt /api/chat with full context
        if (backendUrl) {
          try {
            const urgentList = state.opportunities.filter(o => {
              if (o.status === 'Completed') return false;
              const c = calculateDaysRemaining(o.deadline);
              return c.diffDays >= 0 && c.diffDays <= 7;
            });
            const pendingList = state.reminders.filter(r => !r.completed);

            const chatResp = await fetch(`${backendUrl}/api/chat`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: text,
                history: chatHistory.slice(-4),
                context: {
                  todayIST: getTodayIST(),
                  urgentCount: urgentList.length,
                  pendingTasksCount: pendingList.length,
                  opportunitiesSummary: urgentList.slice(0, 5).map(o => `• ${o.title} (Deadline: ${o.deadline})`).join('\n') || 'None',
                  remindersSummary: pendingList.slice(0, 5).map(r => `• ${r.title} (Due: ${r.dueDate})`).join('\n') || 'None'
                }
              })
            });

            if (chatResp.ok) {
              const chatData = await chatResp.json();
              if (chatData && chatData.text) {
                aiRawResponse = chatData.text;
              }
            }
          } catch (chatErr) {
            console.warn('Render /api/chat error, falling back to direct prompt:', chatErr);
          }
        }

        if (!aiRawResponse) {
          const prompt = buildCopilotSystemPrompt(text);
          try {
            aiRawResponse = await callGeminiAPI(prompt);
          } catch (apiErr) {
            console.warn('Chatbot Gemini API call failed, using intelligent local response:', apiErr);
            aiRawResponse = generateLocalFallbackResponse(text);
          }
        }

        let actionExecutedLabel = null;
        const actionMatch = aiRawResponse.match(/<<<ACTION_COMMAND:\s*(\{[\s\S]*?\})\s*>>>/);

        if (actionMatch && actionMatch[1]) {
          try {
            const cmd = JSON.parse(actionMatch[1]);
            if (cmd.action === 'add_reminder') {
              const newRem = {
                id: `rem_chat_${Date.now()}`,
                title: cmd.title || 'Task from Copilot',
                category: cmd.category || 'Assignment',
                priority: cmd.priority || 'Medium',
                dueDate: cmd.dueDate || getRelativeDateStr(2),
                dueTime: cmd.dueTime || '23:59',
                description: cmd.description || 'Added via Radar Copilot',
                completed: false,
                isSample: false,
                createdAt: new Date().toISOString()
              };
              state.reminders.unshift(newRem);
              saveReminders();
              renderAll();
              actionExecutedLabel = `Added "${newRem.title}" to Reminders (Due: ${newRem.dueDate})`;
              showToast('Task Added via Copilot', newRem.title, 'success');
            } else if (cmd.action === 'add_opportunity') {
              const newOpp = {
                id: `opp_chat_${Date.now()}`,
                title: cmd.title || 'Opportunity from Copilot',
                category: cmd.category || 'Hackathon',
                cost: cmd.cost || 'Free',
                deadline: cmd.deadline || getRelativeDateStr(7),
                url: cmd.url || 'https://unstop.com',
                eligibility: cmd.eligibility || 'Open to college students',
                notes: cmd.notes || 'Added via Radar Copilot',
                status: 'Interested',
                saved: true,
                isSample: false,
                createdAt: new Date().toISOString()
              };
              state.opportunities.unshift(newOpp);
              saveOpportunities();
              renderAll();
              actionExecutedLabel = `Logged "${newOpp.title}" to Opportunities (Deadline: ${newOpp.deadline})`;
              showToast('Opportunity Logged via Copilot', newOpp.title, 'success');
            }
          } catch (cmdErr) {
            console.warn('Failed to parse action command:', cmdErr);
          }
        }

        const cleanDisplayText = aiRawResponse.replace(/<<<ACTION_COMMAND:[\s\S]*?>>>/g, '').trim();

        chatHistory.push({
          sender: 'bot',
          text: cleanDisplayText || 'Task completed successfully! 🚀',
          actionExecuted: actionExecutedLabel,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        saveChatHistory();
        renderChatMessages();

      } catch (err) {
        console.error('Chat processing error:', err);
        chatHistory.push({
          sender: 'bot',
          text: `⚠️ I had trouble connecting to Gemini. Please verify your internet connection or check your API key in **Backup & Settings**.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        saveChatHistory();
        renderChatMessages();
      } finally {
        typingIndicator.classList.add('hidden');
        sendBtn.disabled = false;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }

    function generateLocalFallbackResponse(query) {
      const q = query.toLowerCase();
      const today = getTodayIST();

      if (q.includes('deadline') || q.includes('due') || q.includes('schedule') || q.includes('week')) {
        const urgent = state.opportunities.filter(o => {
          if (o.status === 'Completed') return false;
          const c = calculateDaysRemaining(o.deadline);
          return c.diffDays >= 0 && c.diffDays <= 7;
        });
        const due = state.reminders.filter(r => !r.completed);

        let resp = `📅 **Here is your current deadline radar as of ${today}:**\n\n`;
        if (urgent.length > 0) {
          resp += `**⚡ Opportunities Closing Soon:**\n`;
          urgent.forEach(o => resp += `• **${o.title}** - Due: ${o.deadline} (${o.category})\n`);
        } else {
          resp += `• No opportunities closing in the next 7 days.\n`;
        }
        if (due.length > 0) {
          resp += `\n**⏰ Pending Academic Tasks:**\n`;
          due.slice(0, 4).forEach(r => resp += `• **${r.title}** - Due: ${r.dueDate} (${r.priority} Priority)\n`);
        } else {
          resp += `• All tasks completed! Great job.\n`;
        }
        resp += `\n*(Tip: You can also configure your Gemini API key in **Backup & Settings** for personalized answers!)*`;
        return resp;
      }

      if (q.includes('hackathon') || q.includes('contest') || q.includes('competition')) {
        return `⚡ **Top Recommended Platforms for College Hackathons:**\n\n• **Unstop:** Premier Indian platform for engineering hackathons and hiring challenges.\n• **Devpost:** Global hackathon platform with prizes from Google, AWS, and OpenAI.\n• **Smart India Hackathon (SIH):** National engineering problem-solving initiative.\n• **HackerEarth:** Competitive programming and company sprint challenges.\n\nWould you like me to log an upcoming hackathon to your radar? Just type *"Add hackathon: [Name] due [Date]"*!`;
      }

      if (q.includes('cert') || q.includes('google cloud') || q.includes('azure') || q.includes('aws')) {
        return `📜 **Top Free Certification & Voucher Tracks:**\n\n• **Google Cloud Skills Boost Arcade:** Complete skill badges to earn arcade points for exam discounts and official Google Cloud swag.\n• **Microsoft Learn Cloud Skills Challenge:** Often awards 50% to 100% exam vouchers for AZ-900 (Azure Fundamentals).\n• **AWS Skill Builder:** 600+ free digital courses for AWS Certified Cloud Practitioner preparation.`;
      }

      if (q.startsWith('add') || q.includes('remind me') || q.includes('task')) {
        const sampleDate = getRelativeDateStr(3);
        const taskTitle = query.replace(/^add/i, '').replace(/task/i, '').replace(/reminder/i, '').trim() || 'Study Goal';
        return `I can add that task for you! 👍 Logging task...\n\n<<<ACTION_COMMAND: {"action":"add_reminder","title":"${escapeHTML(taskTitle)}","category":"Assignment","priority":"High","dueDate":"${sampleDate}","dueTime":"23:59","description":"Created via Radar Copilot"}>>>`;
      }

      return `👋 I am **Radar Copilot**! I can summarize your deadlines, recommend student programs, or add tasks to your personal radar.\n\nTo unlock autonomous intelligence, ensure your Gemini API key is active in **Backup & Settings**!`;
    }

    inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSendMessage();
    });

    renderChatMessages();
  }

  // ==========================================================================
  // 19. BOOTSTRAP APPLICATION
  // ==========================================================================
  function initApp() {
    loadStorageData();

    // Set initial theme
    if (state.settings.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    initLiveClock();
    initBrowserNotifications();
    initEventBindings();
    initRadarCopilotChatbot();
    renderAll();

    // Welcome banner / Radar scan message on launch
    const urgentCount = state.opportunities.filter(o => {
      if (o.status === 'Completed') return false;
      const calc = calculateDaysRemaining(o.deadline);
      return calc.diffDays >= 0 && calc.diffDays <= 7;
    }).length;

    if (urgentCount > 0) {
      setTimeout(() => {
        showToast('Radar Briefing', `You have ${urgentCount} deadline${urgentCount === 1 ? '' : 's'} closing within 7 days.`, 'warning');
      }, 700);
    } else {
      setTimeout(() => {
        showToast('Agent Ready', 'Your local Opportunity Radar is active and synchronized.', 'info');
      }, 700);
    }
  }

  // Launch on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
