"""
JJ&A Ultrasound Instruments Blog API
Flask backend for blog posts, comments, and admin authentication
"""

import os
import uuid
import sqlite3
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, g, send_from_directory
from flask_cors import CORS
from functools import wraps
import re
import html
import jwt
import bcrypt
import secrets
from werkzeug.middleware.proxy_fix import ProxyFix
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
app.url_map.strict_slashes = False
CORS(app, supports_credentials=True)

# Configuration
DATABASE = os.environ.get('DATABASE_PATH', '/app/data/blog.db')
UPLOAD_DIR = os.path.join(os.path.dirname(DATABASE), 'uploads')
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp', 'gif'}
MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5MB
JWT_SECRET = os.environ.get('JWT_SECRET', secrets.token_hex(32))
JWT_EXPIRY_HOURS = int(os.environ.get('JWT_EXPIRY_HOURS', 720))  # 30 days default
ADMIN_KEY = os.environ.get('ADMIN_KEY', 'change-this-in-production')

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    os.makedirs(os.path.dirname(DATABASE), exist_ok=True)
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
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
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'admin',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )
    ''')
    
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_posts_published ON posts (published)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments (approved)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_username ON users (username)')
    
    conn.commit()
    
    cursor.execute('SELECT COUNT(*) FROM users')
    if cursor.fetchone()[0] == 0:
        default_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
        password_hash = bcrypt.hashpw(default_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        try:
            cursor.execute('''
                INSERT INTO users (username, email, password_hash, role)
                VALUES (?, ?, ?, ?)
            ''', ('admin', 'admin@jja-instruments.com', password_hash, 'admin'))
            conn.commit()
            print(f"Created default admin user. Username: admin, Password: {default_password}")
            print("IMPORTANT: Change the default password immediately!")
        except sqlite3.IntegrityError:
            pass
    
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

<p>Contact JJ&A Ultrasound Instruments to learn how our Mark V Doppler Phantom can support your QA program.</p>''',
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
<p>For facilities performing Doppler examinations, ACR requires verification of velocity measurement accuracy. This is typically accomplished using a calibrated Doppler phantom like the JJ&A Ultrasound Instruments Mark V.</p>

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
                'title': 'Introduction to High-Intensity Focused Ultrasound (HIFU) Technology',
                'slug': 'introduction-to-hifu-technology',
                'excerpt': 'Explore the principles, applications, and future of High-Intensity Focused Ultrasound systems.',
                'content': '''<p>High-Intensity Focused Ultrasound (HIFU) represents one of the most significant advances in non-invasive therapeutic ultrasound technology.</p>

<h3>How HIFU Works</h3>
<p>HIFU systems concentrate ultrasound waves at a focal point within the body, generating temperatures exceeding 60°C. This rapid heating causes coagulative necrosis of targeted tissue while sparing surrounding structures.</p>

<h3>Clinical Applications</h3>
<ul>
<li><strong>Oncology:</strong> Treatment of prostate, liver, kidney, breast, and pancreatic tumors</li>
<li><strong>Urology:</strong> Benign prostatic hyperplasia (BPH) treatment</li>
<li><strong>Gynecology:</strong> Uterine fibroid ablation</li>
<li><strong>Neurology:</strong> Essential tremor and Parkinson's disease treatment</li>
</ul>

<h3>The Role of HIFU Generators</h3>
<p>The HIFU generator is the heart of any therapeutic ultrasound system. JJ&A Ultrasound Instruments offers HIFU generator solutions designed for both clinical applications and research environments.</p>''',
                'author': 'Dr. Elena Rodriguez, PhD',
                'category': 'Technology',
                'tags': 'HIFU,Therapeutic Ultrasound,Technology,Research'
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

def create_token(user_id, username, role):
    payload = {
        'user_id': user_id,
        'username': username,
        'role': role,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        admin_key = request.headers.get('X-Admin-Key')
        
        if admin_key == ADMIN_KEY:
            g.current_user = {'user_id': 0, 'username': 'legacy_admin', 'role': 'admin'}
            return f(*args, **kwargs)
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization required'}), 401
        
        token = auth_header.split(' ')[1]
        payload = verify_token(token)
        
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        g.current_user = payload
        return f(*args, **kwargs)
    return decorated

def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        admin_key = request.headers.get('X-Admin-Key')
        
        if admin_key == ADMIN_KEY:
            g.current_user = {'user_id': 0, 'username': 'legacy_admin', 'role': 'admin'}
            return f(*args, **kwargs)
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization required'}), 401
        
        token = auth_header.split(' ')[1]
        payload = verify_token(token)
        
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        if payload.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        g.current_user = payload
        return f(*args, **kwargs)
    return decorated

def sanitize_html(text):
    allowed_tags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h3', 'h4', 'a', 'blockquote']
    text = html.escape(text)
    return text

def create_slug(title):
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'blog-api'})


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    db = get_db()
    user = db.execute(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        (username, username)
    ).fetchone()
    
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    db.execute(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        (user['id'],)
    )
    db.commit()
    
    token = create_token(user['id'], user['username'], user['role'])
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'role': user['role']
        }
    })

@app.route('/api/auth/verify', methods=['GET'])
@require_auth
def verify_auth():
    return jsonify({
        'valid': True,
        'user': {
            'id': g.current_user.get('user_id'),
            'username': g.current_user.get('username'),
            'role': g.current_user.get('role')
        }
    })

@app.route('/api/auth/refresh', methods=['POST'])
@require_auth
def refresh_token():
    # Generate a new token with fresh expiry
    new_token = create_token(g.current_user['user_id'], g.current_user['username'], g.current_user['role'])

    return jsonify({
        'token': new_token,
        'user': {
            'id': g.current_user.get('user_id'),
            'username': g.current_user.get('username'),
            'role': g.current_user.get('role')
        }
    })

@app.route('/api/auth/change-password', methods=['POST'])
@require_auth
def change_password():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')
    
    if not current_password or not new_password:
        return jsonify({'error': 'Current and new password are required'}), 400
    
    if len(new_password) < 8:
        return jsonify({'error': 'New password must be at least 8 characters'}), 400
    
    db = get_db()
    user = db.execute(
        'SELECT * FROM users WHERE id = ?',
        (g.current_user['user_id'],)
    ).fetchone()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if not bcrypt.checkpw(current_password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({'error': 'Current password is incorrect'}), 401
    
    new_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    db.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        (new_hash, user['id'])
    )
    db.commit()
    
    return jsonify({'message': 'Password changed successfully'})


@app.route('/api/posts', methods=['GET'])
def get_posts():
    db = get_db()
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    category = request.args.get('category')
    tag = request.args.get('tag')
    include_unpublished = request.args.get('include_unpublished', 'false').lower() == 'true'
    
    per_page = min(per_page, 50)
    offset = (page - 1) * per_page
    
    if include_unpublished:
        auth_header = request.headers.get('Authorization')
        admin_key = request.headers.get('X-Admin-Key')
        
        is_admin = False
        if admin_key == ADMIN_KEY:
            is_admin = True
        elif auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            payload = verify_token(token)
            if payload and payload.get('role') == 'admin':
                is_admin = True
        
        if not is_admin:
            include_unpublished = False
    
    query = 'SELECT * FROM posts'
    params = []
    
    if not include_unpublished:
        query += ' WHERE published = 1'
    
    if category:
        query += ' AND category = ?' if 'WHERE' in query else ' WHERE category = ?'
        params.append(category)
    
    if tag:
        query += ' AND tags LIKE ?' if 'WHERE' in query else ' WHERE tags LIKE ?'
        params.append(f'%{tag}%')
    
    count_query = query.replace('SELECT *', 'SELECT COUNT(*)')
    total = db.execute(count_query, params).fetchone()[0]
    
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
    db = get_db()
    
    auth_header = request.headers.get('Authorization')
    admin_key = request.headers.get('X-Admin-Key')
    
    is_admin = False
    if admin_key == ADMIN_KEY:
        is_admin = True
    elif auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        payload = verify_token(token)
        if payload and payload.get('role') == 'admin':
            is_admin = True
    
    if is_admin:
        post = db.execute('SELECT * FROM posts WHERE slug = ?', (slug,)).fetchone()
    else:
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
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('content'):
        return jsonify({'error': 'Title and content are required'}), 400
    
    db = get_db()
    
    slug = data.get('slug') or create_slug(data['title'])
    
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
            data.get('author', g.current_user.get('username', 'Admin')),
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
    db = get_db()
    categories = db.execute('''
        SELECT category, COUNT(*) as count 
        FROM posts 
        WHERE published = 1 
        GROUP BY category 
        ORDER BY count DESC
    ''').fetchall()
    
    return jsonify([dict(cat) for cat in categories])


@app.route('/api/posts/<slug>/comments', methods=['GET'])
def get_comments(slug):
    db = get_db()
    
    post = db.execute('SELECT id FROM posts WHERE slug = ?', (slug,)).fetchone()
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    comments = db.execute('''
        SELECT id, post_id, parent_id, author_name, content, created_at
        FROM comments 
        WHERE post_id = ? AND approved = 1
        ORDER BY created_at ASC
    ''', (post['id'],)).fetchall()
    
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
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    author_name = data.get('author_name', '').strip()
    author_email = data.get('author_email', '').strip()
    content = data.get('content', '').strip()
    
    if not author_name or not author_email or not content:
        return jsonify({'error': 'Name, email, and comment are required'}), 400
    
    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', author_email):
        return jsonify({'error': 'Invalid email address'}), 400
    
    if len(content) > 5000:
        return jsonify({'error': 'Comment too long (max 5000 characters)'}), 400
    
    if len(author_name) > 100:
        return jsonify({'error': 'Name too long (max 100 characters)'}), 400
    
    db = get_db()
    
    post = db.execute('SELECT id FROM posts WHERE slug = ? AND published = 1', (slug,)).fetchone()
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    parent_id = data.get('parent_id')
    
    if parent_id:
        parent = db.execute(
            'SELECT id FROM comments WHERE id = ? AND post_id = ?', 
            (parent_id, post['id'])
        ).fetchone()
        if not parent:
            return jsonify({'error': 'Parent comment not found'}), 404
    
    try:
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
    db = get_db()
    
    try:
        db.execute('UPDATE comments SET approved = 1 WHERE id = ?', (comment_id,))
        db.commit()
        return jsonify({'message': 'Comment approved'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/uploads', methods=['POST'])
@require_admin
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({'error': f'File type not allowed. Allowed: {", ".join(ALLOWED_EXTENSIONS)}'}), 400

    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    if size > MAX_UPLOAD_SIZE:
        return jsonify({'error': f'File too large. Maximum size: {MAX_UPLOAD_SIZE // (1024*1024)}MB'}), 400

    filename = f'{uuid.uuid4().hex}.{ext}'
    file.save(os.path.join(UPLOAD_DIR, filename))

    return jsonify({'url': f'/api/uploads/{filename}'}), 201


@app.route('/api/uploads/<filename>')
def serve_upload(filename):
    safe_name = secure_filename(filename)
    if safe_name != filename:
        return jsonify({'error': 'Invalid filename'}), 400
    return send_from_directory(UPLOAD_DIR, safe_name)


with app.app_context():
    init_db()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=os.environ.get('FLASK_DEBUG', False))
