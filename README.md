# BigQuery Release Notes Tracker ⚡

A high-fidelity web application built using **Python Flask** and vanilla **HTML, CSS, and JavaScript** that parses Google Cloud BigQuery release notes and offers advanced filtering, search, and social sharing capabilities.

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

## 🛠️ Built With

*   [Flask](https://flask.palletsprojects.com/) - Python web framework
*   [BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/) - HTML/XML parsing
*   [Requests](https://requests.readthedocs.io/) - HTTP requests library
*   Vanilla HTML5, CSS3 (variables, transitions, animations), and ES6+ JavaScript
