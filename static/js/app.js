// Global App State
let releaseNotes = [];
let currentFilter = 'all';
let searchQuery = '';

// DOM Elements
const body = document.body;
const btnRefresh = document.getElementById('btn-refresh');
const refreshIcon = document.getElementById('refresh-icon');
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = themeToggle.querySelector('.sun-icon');
const moonIcon = themeToggle.querySelector('.moon-icon');
const searchInput = document.getElementById('search-input');
const filterPills = document.querySelectorAll('.filter-pill');
const feedContainer = document.getElementById('release-feed');
const skeletonFeed = document.getElementById('skeleton-feed');
const noResults = document.getElementById('no-results');
const btnClearSearch = document.getElementById('btn-clear-search');

// Modal Elements
const twitterModal = document.getElementById('twitter-modal');
const tweetTextarea = document.getElementById('tweet-textarea');
const modalClose = document.getElementById('modal-close');
const btnModalCancel = document.getElementById('btn-modal-cancel');
const btnModalTweet = document.getElementById('btn-modal-tweet');
const charCount = document.getElementById('char-count');
const progressCircle = document.querySelector('.progress-ring__circle');

// Circle properties for character counter
const circleRadius = 10;
const circleCircumference = 2 * Math.PI * circleRadius;

// Initialize circle stroke-dasharray
if (progressCircle) {
  progressCircle.style.strokeDasharray = `${circleCircumference} ${circleCircumference}`;
  progressCircle.style.strokeDashoffset = circleCircumference;
}

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'theme-dark';
  body.className = savedTheme;
  updateThemeIcons(savedTheme);
}

function updateThemeIcons(theme) {
  if (theme === 'theme-light') {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }
}

themeToggle.addEventListener('click', () => {
  if (body.classList.contains('theme-dark')) {
    body.classList.replace('theme-dark', 'theme-light');
    localStorage.setItem('theme', 'theme-light');
    updateThemeIcons('theme-light');
    showToast('Switched to light theme', 'success');
  } else {
    body.classList.replace('theme-light', 'theme-dark');
    localStorage.setItem('theme', 'theme-dark');
    updateThemeIcons('theme-dark');
    showToast('Switched to dark theme', 'success');
  }
});

/* ==========================================================================
   TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '';
  if (type === 'success') {
    icon = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === 'error') {
    icon = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    icon = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.6rem;">
      ${icon}
      <span class="toast-content">${message}</span>
    </div>
    <button class="toast-close">
      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;

  container.appendChild(toast);

  // Close toast on button click
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  });

  // Auto-remove toast
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

/* ==========================================================================
   DATA FETCH & LOADING
   ========================================================================== */
async function loadReleaseNotes(isRefresh = false) {
  try {
    // Show spinner and skeleton loader
    refreshIcon.classList.add('spinning');
    btnRefresh.disabled = true;
    
    if (isRefresh) {
      feedContainer.style.opacity = '0.5';
    } else {
      feedContainer.style.display = 'none';
      skeletonFeed.style.display = 'flex';
    }
    noResults.style.display = 'none';

    let fetchUrl = 'static/data/release-notes.json';
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.port !== '') {
      fetchUrl = '/api/release-notes';
    }
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error('Failed to fetch release notes.');
    
    releaseNotes = await response.ok ? await response.json() : [];
    
    // Process stats
    updateStats();
    
    // Render
    renderFeed();
    
    if (isRefresh) {
      showToast('Release notes successfully refreshed', 'success');
    }
  } catch (error) {
    console.error(error);
    showToast(error.message || 'Error loading release notes.', 'error');
    
    if (!isRefresh) {
      feedContainer.innerHTML = `<div class="no-results-state"><h3>Failed to load</h3><p>Could not fetch release notes at this time.</p></div>`;
      feedContainer.style.display = 'block';
    }
  } finally {
    // Hide spinner and skeleton loader
    refreshIcon.classList.remove('spinning');
    btnRefresh.disabled = false;
    feedContainer.style.opacity = '1';
    skeletonFeed.style.display = 'none';
  }
}

/* ==========================================================================
   STATISTICS DASHBOARD
   ========================================================================== */
function updateStats() {
  document.getElementById('stat-total-dates').querySelector('.stat-value').textContent = releaseNotes.length;
  
  let totalUpdates = 0;
  let features = 0;
  let issues = 0;
  let breaking = 0;

  releaseNotes.forEach(entry => {
    entry.updates.forEach(update => {
      totalUpdates++;
      const type = update.type.toLowerCase();
      if (type.includes('feature')) features++;
      else if (type.includes('issue')) issues++;
      else if (type.includes('breaking')) breaking++;
    });
  });

  document.getElementById('stat-total-updates').querySelector('.stat-value').textContent = totalUpdates;
  document.getElementById('stat-features').querySelector('.stat-value').textContent = features;
  document.getElementById('stat-issues').querySelector('.stat-value').textContent = issues;
  document.getElementById('stat-breaking').querySelector('.stat-value').textContent = breaking;
}

/* ==========================================================================
   RENDER FEED
   ========================================================================== */
function renderFeed() {
  feedContainer.innerHTML = '';
  
  // Filter and search
  const filteredData = releaseNotes.map(entry => {
    // Filter updates within each entry
    const filteredUpdates = entry.updates.filter(update => {
      const typeMatches = currentFilter === 'all' || update.type.toLowerCase() === currentFilter.toLowerCase();
      
      const query = searchQuery.toLowerCase().trim();
      const textMatches = query === '' || 
                          update.text.toLowerCase().includes(query) || 
                          update.type.toLowerCase().includes(query) || 
                          entry.date.toLowerCase().includes(query);
                          
      return typeMatches && textMatches;
    });

    return {
      ...entry,
      updates: filteredUpdates
    };
  }).filter(entry => entry.updates.length > 0); // Keep only entries that have matching updates

  if (filteredData.length === 0) {
    feedContainer.style.display = 'none';
    noResults.style.display = 'flex';
    return;
  }

  noResults.style.display = 'none';
  feedContainer.style.display = 'block';

  // Build the DOM
  filteredData.forEach(entry => {
    const group = document.createElement('div');
    group.className = 'release-group';
    
    // Group Header (Date)
    const header = document.createElement('div');
    header.className = 'release-date-header';
    header.innerHTML = `
      <div class="date-badge-wrapper">
        <div class="date-indicator">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
        <h2 class="release-date-title">${entry.date}</h2>
      </div>
      <a href="${entry.link}" target="_blank" rel="noopener noreferrer" class="link-original">
        <span>View Original</span>
        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </a>
    `;
    group.appendChild(header);
    
    // Updates List
    const list = document.createElement('div');
    list.className = 'updates-list';
    
    entry.updates.forEach((update, idx) => {
      const card = document.createElement('article');
      card.className = 'update-card';
      
      const badgeClass = getBadgeClass(update.type);
      
      card.innerHTML = `
        <div class="card-header">
          <span class="type-badge ${badgeClass}">
            ${update.type}
          </span>
          <div class="card-actions">
            <button class="btn-card-action btn-copy" title="Copy text to clipboard">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <button class="btn-card-action btn-tweet" title="Share on X (Twitter)">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
          </div>
        </div>
        <div class="card-content">
          ${update.html}
        </div>
      `;
      
      // Wire Card Actions
      card.querySelector('.btn-copy').addEventListener('click', () => copyToClipboard(update.text));
      card.querySelector('.btn-tweet').addEventListener('click', () => openTweetModal(entry.date, update.type, update.text, entry.link));
      
      list.appendChild(card);
    });
    
    group.appendChild(list);
    feedContainer.appendChild(group);
  });
}

function getBadgeClass(type) {
  const t = type.toLowerCase();
  if (t.includes('feature')) return 'badge-feature';
  if (t.includes('issue')) return 'badge-issue';
  if (t.includes('change')) return 'badge-change';
  if (t.includes('announcement')) return 'badge-announcement';
  if (t.includes('breaking')) return 'badge-breaking';
  return 'badge-feature'; // fallback
}

/* ==========================================================================
   CLIPBOARD ACTION
   ========================================================================== */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => showToast('Copied update to clipboard!', 'success'))
    .catch(err => {
      console.error('Copy failed', err);
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast('Copied update to clipboard!', 'success');
      } catch (e) {
        showToast('Failed to copy to clipboard', 'error');
      }
      document.body.removeChild(textarea);
    });
}

/* ==========================================================================
   TWITTER SHARE MODAL
   ========================================================================== */
let currentShareUrl = '';

function openTweetModal(date, type, text, link) {
  currentShareUrl = link;
  
  // Format draft
  // Example: "BigQuery (June 15, 2026) [Feature]: Use Gemini Cloud Assist to analyze SQL queries and receive recommendations... #BigQuery"
  const prefix = `BigQuery Update (${date}) [${type}]: `;
  const suffix = ` #BigQuery #GoogleCloud`;
  
  // Max available text space for description (280 - prefix - suffix - 23 (standard URL size on X))
  const urlPlaceholderLength = 23;
  const maxDescLength = 280 - prefix.length - suffix.length - urlPlaceholderLength - 4; // 4 for spaces and ellipsis
  
  let desc = text;
  if (desc.length > maxDescLength) {
    desc = desc.substring(0, maxDescLength - 3).trim() + '...';
  }
  
  const fullText = `${prefix}${desc}${suffix}`;
  tweetTextarea.value = fullText;
  
  updateCharCount();
  
  twitterModal.style.display = 'flex';
  tweetTextarea.focus();
}

function closeTweetModal() {
  twitterModal.style.display = 'none';
  tweetTextarea.value = '';
}

function updateCharCount() {
  const currentLength = tweetTextarea.value.length;
  // X counts urls as 23 characters, so let's adjust if our text contains links,
  // but since we append the URL on send, we just count actual length + url size (24 for space and url).
  const totalLength = currentLength + 24; 
  const remaining = 280 - totalLength;
  
  charCount.textContent = remaining;
  
  if (remaining < 0) {
    charCount.style.color = 'var(--color-breaking)';
    btnModalTweet.disabled = true;
  } else if (remaining <= 20) {
    charCount.style.color = 'var(--color-issue)';
    btnModalTweet.disabled = false;
  } else {
    charCount.style.color = 'var(--text-secondary)';
    btnModalTweet.disabled = false;
  }
  
  // Update progress ring
  if (progressCircle) {
    const percent = Math.min(100, Math.max(0, (totalLength / 280) * 100));
    const offset = circleCircumference - (percent / 100) * circleCircumference;
    progressCircle.style.strokeDashoffset = offset;
    
    // Change progress ring color based on remaining chars
    if (remaining < 0) {
      progressCircle.style.stroke = 'var(--color-breaking)';
    } else if (remaining <= 20) {
      progressCircle.style.stroke = 'var(--color-issue)';
    } else {
      progressCircle.style.stroke = 'var(--accent-primary)';
    }
  }
}

// Modal event listeners
modalClose.addEventListener('click', closeTweetModal);
btnModalCancel.addEventListener('click', closeTweetModal);
tweetTextarea.addEventListener('input', updateCharCount);

btnModalTweet.addEventListener('click', () => {
  const text = tweetTextarea.value;
  const tweetText = `${text} ${currentShareUrl}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  
  window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  closeTweetModal();
  showToast('Twitter share intent opened in new tab!', 'success');
});

// Close modal on escape key or clicking outside
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && twitterModal.style.display === 'flex') {
    closeTweetModal();
  }
});

twitterModal.addEventListener('click', (e) => {
  if (e.target === twitterModal) {
    closeTweetModal();
  }
});

/* ==========================================================================
   TOOLBAR FILTER & SEARCH TRIGGERS
   ========================================================================== */
// Search input input listener
let searchDebounceTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(() => {
    searchQuery = e.target.value;
    renderFeed();
  }, 150);
});

// Clear filters button
btnClearSearch.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  currentFilter = 'all';
  
  filterPills.forEach(p => {
    p.classList.toggle('active', p.getAttribute('data-type') === 'all');
  });
  
  renderFeed();
});

// Filter pills click listener
filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    
    currentFilter = pill.getAttribute('data-type');
    renderFeed();
  });
});

// Refresh button trigger
btnRefresh.addEventListener('click', () => {
  loadReleaseNotes(true);
});

/* ==========================================================================
   APPLICATION ENTRY POINT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadReleaseNotes(false);
});
