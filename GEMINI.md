# JJ&A Ultrasound Instruments Website

## Project Overview
Marketing and e-commerce website for JJ&A Ultrasound Instruments (Flow Velocity String Phantoms, HIFU RF Generators). The project consists of a static frontend and a Python Flask backend for blog functionality.

**Tech Stack:**
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript (served via Nginx).
*   **Backend:** Python 3 (Flask) with SQLite database.
*   **Infrastructure:** Docker & Docker Compose.
*   **Deployment:** Railway (Production).

## Architecture
The application uses a microservices-like architecture within Docker:

1.  **Frontend Service (`flow-phantom-web`):**
    *   Nginx server hosting static assets (`index.html`, `styles.css`, etc.).
    *   Proxies `/api/*` requests to the backend service.
    *   Handles localization via `locales/` JSON files.

2.  **Backend Service (`blog-api`):**
    *   Flask REST API located in `backend/`.
    *   Manages blog posts and comments.
    *   Persists data to a SQLite database (`blog.db`) mounted via Docker volume.

## Building and Running

### Full Stack (Recommended)
Run the entire application (frontend + backend) using Docker Compose:

```bash
# Build and start services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Access the site at http://localhost:8080
```

### Frontend Only (Static Development)
If you only need to edit HTML/CSS/JS, you can serve the root directory:

```bash
# Python 3
python -m http.server 8000
# Access at http://localhost:8000
```

### Backend Only
Refer to `backend/README.md` (if available) or `backend/Dockerfile` for details. Generally run via Docker.

## Key Files & Directories

*   **`index.html`**: Main landing page.
*   **`doppler-phantom.html` / `hifu-generator.html`**: Product specific pages.
*   **`styles.css`**: Global stylesheet (contains CSS variables for theming).
*   **`script.js`**: Main client-side logic (mobile menu, API fetching, translations).
*   **`backend/app.py`**: Main Flask application entry point.
*   **`locales/`**: JSON files for internationalization (en, hi, ja, zh).
*   **`nginx.conf`**: Nginx configuration including API proxy rules.
*   **`docker-compose.yml`**: Definition of services, networks, and volumes.

## Development Conventions

*   **Styling:** Use raw CSS with variables (defined in `:root`). Mobile-first approach.
*   **JavaScript:** Vanilla JS. No build steps (bundlers) required for the frontend.
*   **API Interactions:** `script.js` handles fetching data from `/api/`.
*   **Internationalization:** Update JSON files in `locales/` when adding new text.
*   **Cache Busting:** Update the version query string in `index.html` (e.g., `script.js?v=...`) when modifying JS/CSS.
