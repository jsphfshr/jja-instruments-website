"""
JJ&A Instruments Blog API
Flask backend for blog posts and comments
"""

import os
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from functools import wraps
import re
import html

app = Flask(__name__)
CORS(app)

# Configuration
DATABASE = os.environ.get('DATABASE_PATH', '/app/data/blog.db')
ADMIN_KEY = os.environ.get('ADMIN_KEY', 'change-this-in-production')

def get_db():
    """Get database connection for current request"""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    """Close database connection at end of request"""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    """Initialize database tables"""
    os.makedirs(os.path.dirname(DATABASE), exist_ok=True)
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Create blog posts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            excerpt TEXT,
            content TEXT NOT NULL,
            author TEXT NOT NULL,
            category TEXT DEFAULT 'General',
            tags TEXT,
            featured_image TEXT,
            published BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create comments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            parent_id INTEGER DEFAULT NULL,
            author_name TEXT NOT NULL,
            author_email TEXT NOT NULL,
            content TEXT NOT NULL,
            approved BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
            FOREIGN KEY (parent_id) REFERENCES comments (id) ON DELETE CASCADE
        )
    ''')
    
    # Create indexes
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_posts_published ON posts (published)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments (approved)')
    
    conn.commit()
    
    # Insert sample blog posts if database is empty
    cursor.execute('SELECT COUNT(*) FROM posts')
    if cursor.fetchone()[0] == 0:
        sample_posts = [
            {
                'title': 'Understanding Doppler Ultrasound Quality Assurance',
                'slug': 'understanding-doppler-ultrasound-qa',
                'excerpt': 'A comprehensive guide to implementing effective QA programs for your Doppler ultrasound equipment.',
                'content': '''<p>Quality assurance (QA) in Doppler ultrasound is essential for ensuring accurate diagnostic results and maintaining regulatory compliance. This article explores the key components of an effective QA program.</p>

<h3>Why Doppler QA Matters</h3>
<p>Doppler ultrasound measurements directly impact clinical decisions in vascular, cardiac, and obstetric applications. Inaccurate velocity measurements can lead to misdiagnosis of conditions like carotid stenosis or valve disease.</p>

<h3>Key QA Components</h3>
<ul>
<li><strong>Velocity Accuracy Testing:</strong> Regular verification using calibrated phantoms ensures your system measures blood flow velocities correctly.</li>
<li><strong>Angle Correction Verification:</strong> Testing at multiple Doppler angles (30°, 45°, 60°) validates the angle correction algorithm.</li>
<li><strong>Documentation:</strong> Maintaining records for accreditation bodies like ACR, IAC, and ICAVL.</li>
</ul>

<h3>Recommended Testing Frequency</h3>
<p>Most accrediting organizations recommend annual Doppler QA testing at minimum. However, quarterly testing provides better ongoing verification and early detection of equipment drift.</p>

<p>Contact JJ&A Instruments to learn how our Mark V Doppler Phantom can support your QA program.</p>''',
                'author': 'Dr. Sarah Chen',
                'category': 'Quality Assurance',
                'tags': 'QA,Doppler,Ultrasound,Compliance'
            },
            {
                'title': 'ACR Accreditation Requirements for Ultrasound Facilities',
                'slug': 'acr-accreditation-requirements-ultrasound',
                'excerpt': 'Navigate the ACR ultrasound accreditation process with this detailed overview of requirements and best practices.',
                'content': '''<p>The American College of Radiology (ACR) accreditation program sets standards for ultrasound quality across the United States. Understanding these requirements is crucial for facility compliance.</p>

<h3>ACR Ultrasound Accreditation Overview</h3>
<p>ACR accreditation demonstrates a commitment to quality patient care and is often required by insurance providers and healthcare systems.</p>

<h3>Equipment QA Requirements</h3>
<p>The ACR requires documented quality assurance testing including:</p>
<ul>
<li>Annual physics survey by qualified personnel</li>
<li>Regular equipment performance monitoring</li>
<li>Doppler velocity accuracy verification</li>
<li>Image quality assessment</li>
</ul>

<h3>Doppler Testing Specifics</h3>
<p>For facilities performing Doppler examinations, ACR requires verification of velocity measurement accuracy. This is typically accomplished using a calibrated Doppler phantom like the JJ&A Instruments Mark V.</p>

<h3>Documentation Requirements</h3>
<p>All QA testing must be documented with:</p>
<ul>
<li>Date of testing</li>
<li>Equipment tested</li>
<li>Results and any corrective actions</li>
<li>Signature of responsible personnel</li>
</ul>

<p>Need help preparing for ACR accreditation? Our calibration services include documentation support designed for accreditation compliance.</p>''',
                'author': 'Michael Torres, RDMS',
                'category': 'Compliance',
                'tags': 'ACR,Accreditation,Compliance,Regulations'
            },
            {
                'title': 'String Phantom vs Flow Phantom: Choosing the Right QA Tool',
                'slug': 'string-phantom-vs-flow-phantom',
                'excerpt': 'Compare the advantages of string phantoms and flow phantoms for Doppler ultrasound calibration.',
                'content': '''<p>When selecting a Doppler phantom for your QA program, understanding the differences between string phantoms and flow phantoms helps ensure you choose the right tool for your needs.</p>

<h3>String Phantoms</h3>
<p>String phantoms use a moving filament at precisely controlled velocities to generate a Doppler signal.</p>

<h4>Advantages:</h4>
<ul>
<li><strong>High Accuracy:</strong> ±1% velocity accuracy is achievable</li>
<li><strong>Low Maintenance:</strong> No blood-mimicking fluid to prepare or replace</li>
<li><strong>Rapid Setup:</strong> Ready to use in minutes</li>
<li><strong>Consistent Results:</strong> No temperature or viscosity variables</li>
<li><strong>Long Lifespan:</strong> Minimal consumables</li>
</ul>

<h3>Flow Phantoms</h3>
<p>Flow phantoms circulate blood-mimicking fluid through vessel-like structures.</p>

<h4>Advantages:</h4>
<ul>
<li>More realistic acoustic scattering properties</li>
<li>Can simulate pulsatile flow patterns</li>
<li>Better representation of spectral broadening</li>
</ul>

<h4>Disadvantages:</h4>
<ul>
<li>Require temperature control</li>
<li>Blood-mimicking fluid degrades over time</li>
<li>More complex setup and maintenance</li>
<li>Higher ongoing costs</li>
</ul>

<h3>Recommendation</h3>
<p>For routine Doppler velocity calibration and accreditation compliance, string phantoms offer the best combination of accuracy, convenience, and cost-effectiveness. The JJ&A Instruments Mark V is the preferred choice for clinical QA programs worldwide.</p>''',
                'author': 'Dr. James Wilson',
                'category': 'Technology',
                'tags': 'Phantoms,Technology,QA,Equipment'
            }
        ]
        
        for post in sample_posts:
            cursor.execute('''
                INSERT INTO posts (title, slug, excerpt, content, author, category, tags)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (post['title'], post['slug'], post['excerpt'], post['content'], 
                  post['author'], post['category'], post['tags']))
        
        conn.commit()
    
    conn.close()

def require_admin(f):
    """Decorator to require admin authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_key = request.headers.get('X-Admin-Key')
        if auth_key != ADMIN_KEY:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

def sanitize_html(text):
    """Basic HTML sanitization"""
    # Allow basic formatting tags
    allowed_tags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h3', 'h4', 'a', 'blockquote']
    # Escape all HTML first
    text = html.escape(text)
    # Then selectively unescape allowed tags (simplified approach)
    return text

def create_slug(title):
    """Create URL-friendly slug from title"""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')

# Health check endpoint
@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'blog-api'})

# ============ Blog Posts API ============

@app.route('/api/posts', methods=['GET'])
def get_posts():
    """Get all published blog posts"""
    db = get_db()
    
    # Query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    category = request.args.get('category')
    tag = request.args.get('tag')
    
    per_page = min(per_page, 50)  # Limit max per page
    offset = (page - 1) * per_page
    
    # Build query
    query = 'SELECT * FROM posts WHERE published = 1'
    params = []
    
    if category:
        query += ' AND category = ?'
        params.append(category)
    
    if tag:
        query += ' AND tags LIKE ?'
        params.append(f'%{tag}%')
    
    # Get total count
    count_query = query.replace('SELECT *', 'SELECT COUNT(*)')
    total = db.execute(count_query, params).fetchone()[0]
    
    # Get posts
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.extend([per_page, offset])
    
    posts = db.execute(query, params).fetchall()
    
    return jsonify({
        'posts': [dict(post) for post in posts],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total,
            'pages': (total + per_page - 1) // per_page
        }
    })

@app.route('/api/posts/<slug>', methods=['GET'])
def get_post(slug):
    """Get single blog post by slug"""
    db = get_db()
    post = db.execute(
        'SELECT * FROM posts WHERE slug = ? AND published = 1', 
        (slug,)
    ).fetchone()
    
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    return jsonify(dict(post))

@app.route('/api/posts', methods=['POST'])
@require_admin
def create_post():
    """Create new blog post (admin only)"""
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('content'):
        return jsonify({'error': 'Title and content are required'}), 400
    
    db = get_db()
    
    slug = data.get('slug') or create_slug(data['title'])
    
    # Check for duplicate slug
    existing = db.execute('SELECT id FROM posts WHERE slug = ?', (slug,)).fetchone()
    if existing:
        slug = f"{slug}-{int(datetime.now().timestamp())}"
    
    try:
        cursor = db.execute('''
            INSERT INTO posts (title, slug, excerpt, content, author, category, tags, featured_image, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['title'],
            slug,
            data.get('excerpt', ''),
            data['content'],
            data.get('author', 'Admin'),
            data.get('category', 'General'),
            data.get('tags', ''),
            data.get('featured_image', ''),
            data.get('published', True)
        ))
        db.commit()
        
        post = db.execute('SELECT * FROM posts WHERE id = ?', (cursor.lastrowid,)).fetchone()
        return jsonify(dict(post)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/posts/<slug>', methods=['PUT'])
@require_admin
def update_post(slug):
    """Update blog post (admin only)"""
    data = request.get_json()
    db = get_db()
    
    post = db.execute('SELECT * FROM posts WHERE slug = ?', (slug,)).fetchone()
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    try:
        db.execute('''
            UPDATE posts SET 
                title = ?, excerpt = ?, content = ?, author = ?, 
                category = ?, tags = ?, featured_image = ?, published = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE slug = ?
        ''', (
            data.get('title', post['title']),
            data.get('excerpt', post['excerpt']),
            data.get('content', post['content']),
            data.get('author', post['author']),
            data.get('category', post['category']),
            data.get('tags', post['tags']),
            data.get('featured_image', post['featured_image']),
            data.get('published', post['published']),
            slug
        ))
        db.commit()
        
        updated_post = db.execute('SELECT * FROM posts WHERE slug = ?', (slug,)).fetchone()
        return jsonify(dict(updated_post))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/posts/<slug>', methods=['DELETE'])
@require_admin
def delete_post(slug):
    """Delete blog post (admin only)"""
    db = get_db()
    
    post = db.execute('SELECT * FROM posts WHERE slug = ?', (slug,)).fetchone()
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    try:
        db.execute('DELETE FROM posts WHERE slug = ?', (slug,))
        db.commit()
        return jsonify({'message': 'Post deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all categories with post counts"""
    db = get_db()
    categories = db.execute('''
        SELECT category, COUNT(*) as count 
        FROM posts 
        WHERE published = 1 
        GROUP BY category 
        ORDER BY count DESC
    ''').fetchall()
    
    return jsonify([dict(cat) for cat in categories])

# ============ Comments API ============

@app.route('/api/posts/<slug>/comments', methods=['GET'])
def get_comments(slug):
    """Get all approved comments for a post"""
    db = get_db()
    
    # Get post ID
    post = db.execute('SELECT id FROM posts WHERE slug = ?', (slug,)).fetchone()
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    comments = db.execute('''
        SELECT id, post_id, parent_id, author_name, content, created_at
        FROM comments 
        WHERE post_id = ? AND approved = 1
        ORDER BY created_at ASC
    ''', (post['id'],)).fetchall()
    
    # Build comment tree
    comment_dict = {}
    root_comments = []
    
    for comment in comments:
        c = dict(comment)
        c['replies'] = []
        comment_dict[c['id']] = c
        
        if c['parent_id'] is None:
            root_comments.append(c)
        else:
            parent = comment_dict.get(c['parent_id'])
            if parent:
                parent['replies'].append(c)
    
    return jsonify({
        'comments': root_comments,
        'total': len(comments)
    })

@app.route('/api/posts/<slug>/comments', methods=['POST'])
def create_comment(slug):
    """Add a comment to a post"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Validate required fields
    author_name = data.get('author_name', '').strip()
    author_email = data.get('author_email', '').strip()
    content = data.get('content', '').strip()
    
    if not author_name or not author_email or not content:
        return jsonify({'error': 'Name, email, and comment are required'}), 400
    
    # Basic email validation
    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', author_email):
        return jsonify({'error': 'Invalid email address'}), 400
    
    # Content length validation
    if len(content) > 5000:
        return jsonify({'error': 'Comment too long (max 5000 characters)'}), 400
    
    if len(author_name) > 100:
        return jsonify({'error': 'Name too long (max 100 characters)'}), 400
    
    db = get_db()
    
    # Get post ID
    post = db.execute('SELECT id FROM posts WHERE slug = ? AND published = 1', (slug,)).fetchone()
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    parent_id = data.get('parent_id')
    
    # Validate parent comment exists
    if parent_id:
        parent = db.execute(
            'SELECT id FROM comments WHERE id = ? AND post_id = ?', 
            (parent_id, post['id'])
        ).fetchone()
        if not parent:
            return jsonify({'error': 'Parent comment not found'}), 404
    
    try:
        # Auto-approve comments (can be changed to require moderation)
        cursor = db.execute('''
            INSERT INTO comments (post_id, parent_id, author_name, author_email, content, approved)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (post['id'], parent_id, author_name, author_email, content, True))
        db.commit()
        
        comment = db.execute('''
            SELECT id, post_id, parent_id, author_name, content, created_at
            FROM comments WHERE id = ?
        ''', (cursor.lastrowid,)).fetchone()
        
        result = dict(comment)
        result['replies'] = []
        
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/comments/<int:comment_id>', methods=['DELETE'])
@require_admin
def delete_comment(comment_id):
    """Delete a comment (admin only)"""
    db = get_db()
    
    comment = db.execute('SELECT * FROM comments WHERE id = ?', (comment_id,)).fetchone()
    if not comment:
        return jsonify({'error': 'Comment not found'}), 404
    
    try:
        db.execute('DELETE FROM comments WHERE id = ?', (comment_id,))
        db.commit()
        return jsonify({'message': 'Comment deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/comments/<int:comment_id>/approve', methods=['POST'])
@require_admin
def approve_comment(comment_id):
    """Approve a comment (admin only)"""
    db = get_db()
    
    try:
        db.execute('UPDATE comments SET approved = 1 WHERE id = ?', (comment_id,))
        db.commit()
        return jsonify({'message': 'Comment approved'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database on startup
with app.app_context():
    init_db()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=os.environ.get('FLASK_DEBUG', False))
