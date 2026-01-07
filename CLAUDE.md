# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JJ&A Ultrasound Instruments website - A marketing and e-commerce site for precision ultrasound equipment (doppler phantoms, HIFU RF power generators, and ultrasound calibration equipment). This is a full-stack web application with:

- **Frontend**: Static HTML/CSS/JS with nginx serving the content
- **Backend**: Flask API for blog posts and comments system
- **Deployment**: Docker-based containerized setup for local development and production (Railway)

## Architecture

### Frontend (Static Site)
- **index.html**: Main homepage with product overview, features, specs
- **doppler-phantom.html**: Product-specific page for Doppler Phantom device
- **hifu-generator.html**: Product-specific page for HIFU RF Generator
- **styles.css**: Global styles with CSS variables for theming
- **script.js**: Client-side JavaScript handling:
  - Mobile menu toggle
  - Smooth scrolling navigation
  - Scroll-based animations (IntersectionObserver)
  - Blog rendering and comment functionality
  - Language switcher (internationalization)
  - Dynamic API interaction with backend

### Backend (Flask API)
- **backend/app.py**: Flask REST API with SQLite database
  - Blog posts CRUD operations
  - Comments system with threaded replies
  - Admin authentication via `X-Admin-Key` header
  - Health check endpoint at `/health`

### API Proxy Architecture
The nginx frontend proxies `/api/*` requests to the Flask backend:
- **Local**: `http://blog-api:5000` (Docker Compose service)
- **Production**: Environment variable `BLOG_API_URL` set by Railway

### Database
- SQLite database at `/app/data/blog.db` (persisted via Docker volume)
- Tables: `posts`, `comments`
- Initialized automatically on first run with sample blog posts

## Development Commands

### Local Development (Frontend Only)
```bash
# Serve static files with any local server
python -m http.server 8000
npx serve .
php -S localhost:8000
```

### Docker Development (Full Stack)
```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f blog-api
docker-compose logs -f flow-phantom-web

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

### Database Management
```bash
# Access the SQLite database directly
docker exec -it flow-phantom-blog-api sqlite3 /app/data/blog.db

# Reset database (delete volume)
docker-compose down -v
docker-compose up -d --build
```

### Testing Blog API
```bash
# Get all posts
curl http://localhost:8080/api/posts

# Get single post
curl http://localhost:8080/api/posts/understanding-doppler-ultrasound-qa

# Create post (requires admin key)
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: change-this-in-production" \
  -d '{"title":"Test Post","content":"<p>Content</p>","author":"Admin","category":"General"}'

# Add comment
curl -X POST http://localhost:8080/api/posts/post-slug/comments \
  -H "Content-Type: application/json" \
  -d '{"author_name":"User","author_email":"user@example.com","content":"Great article!"}'
```

## Configuration

### Environment Variables
- **BLOG_API_URL**: Backend API URL (production only, set by Railway)
- **BLOG_ADMIN_KEY**: Admin API key for managing posts (set in `.env`)
- **PORT**: Port for services (default: 8080 for frontend, 5000 for backend)
- **DATABASE_PATH**: SQLite database file location (default: `/app/data/blog.db`)

### nginx Configuration
- Template-based config at `nginx.conf`
- Environment substitution for `${BLOG_API_URL}` and `${PORT}`
- CORS headers configured for API proxy
- Static asset caching (1 year for CSS/JS/images)
- SEO file serving (robots.txt, sitemap.xml, BingSiteAuth.xml)

## Key Technical Details

### Cache Busting
The frontend uses version parameters for script.js to prevent browser caching issues:
```html
<script src="script.js?v=20241217"></script>
```
Update the version parameter when modifying script.js.

### SEO Implementation
- Meta tags: title, description, keywords, Open Graph, Twitter Cards
- Structured data: JSON-LD schema for Organization
- Sitemap and robots.txt included
- Canonical URLs pointing to https://jja-instruments.com
- Mobile-responsive design (Google ranking factor)

### Internationalization (i18n)
The site supports multiple languages (English, Hindi, Chinese, Japanese):
- Language switcher in navigation
- Translations loaded dynamically via script.js
- Google Fonts included for international character sets (Noto Sans JP, SC, Devanagari)
- `hreflang` tags in HTML for SEO

### Blog System
- Posts support HTML content, categories, tags, featured images
- Comments are threaded (parent_id for replies)
- Auto-approval for comments (configurable)
- Admin can moderate comments via API
- Sample posts created on first database initialization

### Production Deployment
- Deployed to Railway platform
- Two services: frontend (nginx) and backend (Flask with gunicorn)
- Health checks configured for both services
- Docker images published to Docker Hub (joesinla/flow-phantom-website, joesinla/flow-phantom-blog-api)

## File Modification Notes

### Updating Product Content
- Main page: `index.html`
- Product pages: `doppler-phantom.html`, `hifu-generator.html`
- Always update the version parameter in script tag when modifying script.js

### Updating Styles
- Global styles: `styles.css`
- CSS variables defined in `:root` for easy theming
- Mobile-first responsive design with media queries

### API Changes
- Backend code: `backend/app.py`
- After changes, rebuild backend container: `docker-compose up -d --build blog-api`
- Database schema changes require manual migration or volume reset

### Adding New Pages
1. Create new HTML file (e.g., `new-product.html`)
2. Add to Dockerfile COPY command
3. Link from navigation in all HTML files
4. Update sitemap.xml

## Common Issues

### API Connection Errors
- Ensure both containers are running: `docker ps`
- Check backend health: `curl http://localhost:8080/api/health`
- Verify nginx proxy configuration in nginx.conf
- Check logs: `docker-compose logs -f blog-api`

### Cache Issues
- Browser caching: Update version parameter in script tag
- nginx caching: Configured for static assets only
- Clear browser cache or use incognito mode for testing

### Database Issues
- Reset database: `docker-compose down -v && docker-compose up -d`
- Access database: `docker exec -it flow-phantom-blog-api sqlite3 /app/data/blog.db`
- Backup before major changes: `docker cp flow-phantom-blog-api:/app/data/blog.db ./backup.db`
