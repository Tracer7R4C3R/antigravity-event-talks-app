# BigQuery Release Notes Tracker ⚡

A high-fidelity web application that parses Google Cloud BigQuery release notes and offers advanced filtering, search, and social sharing capabilities.

🌎 **Live Demo**: **[https://Tracer7R4C3R.github.io/antigravity-event-talks-app/](https://Tracer7R4C3R.github.io/antigravity-event-talks-app/)**

---

## 🚀 Features

*   **Atom Feed Parser**: Server-side extraction and parsing of Google Cloud's BigQuery release notes XML feed (`https://docs.cloud.google.com/feeds/bigquery-release-notes.xml`).
*   **Rich Aesthetics**: Customized HSL colors, glassmorphism cards, interactive timelines, loading skeleton cards, and smooth micro-animations.
*   **Persistent Themes**: Dark and Light themes with local storage state persistence.
*   **Filter & Search**: Instant, client-side keyword search and category filter pills (Features, Issues, Changes, Announcements, Breaking).
*   **Stats Dashboard**: Real-time metrics showing the count of total releases and updates by category.
*   **Clipboard Copy**: Copy-to-clipboard button for any release note with toast notifications.
*   **X (Twitter) Share Modal**: Pre-formatted tweet composer that fits within the **280-character limit**, tracks length with a circular progress ring, and opens the X web intent directly.

---

## 📁 Project Structure

```text
bigquery_release_notes_app/
├── app.py                  # Flask application & Feed Parser
├── templates/
│   └── index.html          # HTML5 layout & Modal elements
├── static/
│   ├── css/
│   │   └── style.css       # Clean styling & animations (Dark/Light themes)
│   └── js/
│       └── app.js          # API handling, filtering, and modal controller
├── .gitignore              # Ignores standard Python/IDE environments
└── README.md               # Project documentation
```

---

## ⚙️ Installation & Local Setup

### Prerequisites
*   Python 3.7+
*   pip

### Step 1: Clone the repository
```bash
git clone https://github.com/Tracer7R4C3R/antigravity-event-talks-app.git
cd antigravity-event-talks-app
```

### Step 2: Install dependencies
Install the required Python modules:
```bash
pip install Flask requests beautifulsoup4
```

### Step 3: Run the application
Run the Flask local development server:
```bash
python app.py
```

### Step 4: Open in your browser
Open your browser and navigate to:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 🤖 Self-Updating Engine (CI/CD)

This repository stands out by being **100% automated and self-updating**:
1.  **Scheduled Action**: Every day at midnight UTC, a GitHub Action ([deploy-pages.yml](.github/workflows/deploy-pages.yml)) runs.
2.  **Parser Execution**: The action runs [update_feed.py](update_feed.py) to fetch and parse the latest BigQuery release notes into [release-notes.json](static/data/release-notes.json).
3.  **Automatic Push**: If new release notes are found, they are automatically committed and pushed back to the `main` branch.
4.  **Static Build**: The action runs [build_static.py](build_static.py) to compile the Flask-style templates into standard HTML.
5.  **GitHub Pages Deployment**: The built files are deployed automatically to the `gh-pages` branch, updating the live website with zero user intervention!

---

## 🛠️ Built With

*   [Flask](https://flask.palletsprojects.com/) - Python web framework (for local server execution)
*   [BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/) - HTML/XML parsing
*   [Requests](https://requests.readthedocs.io/) - HTTP requests library
*   Vanilla HTML5, CSS3 (variables, transitions, animations), and ES6+ JavaScript
