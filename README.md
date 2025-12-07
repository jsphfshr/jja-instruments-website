# Flow Velocity String Phantom Website

A professional, SEO-optimized, mobile-friendly website for the Flow Velocity String Phantom medical device - a calibration tool for ultrasound machines. Includes a blog section with comment functionality.

## Quick Start

### Development (Frontend Only)

Simply open `index.html` in a web browser to view the website locally.

For development with live reload, you can use any local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx)
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

### Full Stack with Docker (Recommended)

To run the complete application with the blog backend:

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The website will be available at `http://localhost:8080`

### Environment Variables

Create a `.env` file for production:

```bash
# Admin API key for managing blog posts (change this!)
BLOG_ADMIN_KEY=your-secure-admin-key-here
```

## Features

### Blog & Comments System
- Full blog with categories and tags
- Threaded comment system with replies
- Admin API for managing posts (protected by API key)
- SQLite database for data persistence
- Sample blog posts included

### SEO Optimization
- Semantic HTML5 structure
- Meta tags for search engines (title, description, keywords)
- Open Graph tags for social media sharing
- Twitter Card meta tags
- JSON-LD structured data (Product & MedicalDevice schemas)
- Canonical URL
- Proper heading hierarchy (h1-h6)
- Alt text ready for images
- Mobile-friendly responsive design (Google ranking factor)

### Mobile Responsive
- Mobile-first CSS approach
- Hamburger menu for mobile navigation
- Flexible grid layouts that adapt to all screen sizes
- Touch-friendly buttons and interactive elements
- Optimized font sizes for readability on small screens

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Focus visible styles
- Reduced motion support for users who prefer it
- Semantic HTML structure
- Screen reader friendly

### Performance
- No external dependencies (except Google Fonts)
- Minimal JavaScript
- CSS animations (hardware accelerated)
- Print stylesheet included

## File Structure

```
flow-phantom-website/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # JavaScript functionality
├── nginx.conf          # Nginx configuration
├── Dockerfile          # Frontend Docker image
├── docker-compose.yml  # Multi-container setup
├── backend/            # Blog API backend
│   ├── app.py          # Flask API application
│   ├── requirements.txt # Python dependencies
│   └── Dockerfile      # Backend Docker image
└── README.md           # This file
```

## Blog API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List all published posts |
| GET | `/api/posts/:slug` | Get single post by slug |
| GET | `/api/posts/:slug/comments` | Get comments for a post |
| POST | `/api/posts/:slug/comments` | Add a comment |
| GET | `/api/categories` | List all categories |

### Admin Endpoints (require `X-Admin-Key` header)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts` | Create new post |
| PUT | `/api/posts/:slug` | Update post |
| DELETE | `/api/posts/:slug` | Delete post |
| DELETE | `/api/comments/:id` | Delete comment |
| POST | `/api/comments/:id/approve` | Approve comment |

### Creating Blog Posts via API

```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: your-admin-key" \
  -d '{
    "title": "My New Post",
    "content": "<p>Post content with HTML...</p>",
    "excerpt": "Short description",
    "author": "Author Name",
    "category": "Quality Assurance",
    "tags": "QA,Ultrasound"
  }'
```

## Customization

### Colors
Edit the CSS variables in `styles.css`:

```css
:root {
    --color-primary: #0891b2;      /* Main brand color */
    --color-accent: #f97316;        /* Accent/highlight color */
    --color-bg: #0a1628;            /* Background color */
    /* ... more variables */
}
```

### Content
All content is in `index.html`. Key sections to customize:
- Hero section (main headline and value proposition)
- Features (product benefits)
- Specifications (technical details)
- FAQ (common questions)
- Contact information

### Images
To add product images:
1. Create an `images/` folder
2. Add your images
3. Update the HTML to reference them
4. Add an `og-image.jpg` (1200x630px) for social sharing

## Deployment

### Static Hosting (Recommended)
This site can be deployed to any static hosting service:
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect to Git or drag and drop
- **GitHub Pages**: Push to a GitHub repository
- **AWS S3**: Upload files to an S3 bucket with static hosting

### Domain Setup
1. Purchase a domain (e.g., flowphantom.com)
2. Update the canonical URL in `index.html`
3. Update Open Graph URLs
4. Configure DNS to point to your hosting

### SSL Certificate
Ensure your hosting provider offers HTTPS (most modern hosts do this automatically).

## SEO Checklist

Before launch, complete these SEO tasks:

- [ ] Update canonical URL to your actual domain
- [ ] Create and upload `robots.txt`
- [ ] Create and submit `sitemap.xml` to Google Search Console
- [ ] Add Google Analytics or similar tracking
- [ ] Create social media preview image (`og-image.jpg`)
- [ ] Register with Google Search Console
- [ ] Register with Bing Webmaster Tools
- [ ] Test with Google's Mobile-Friendly Test
- [ ] Test with Google's PageSpeed Insights
- [ ] Verify structured data with Google's Rich Results Test

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## License

This website template is provided for the Flow Phantom medical device product.
