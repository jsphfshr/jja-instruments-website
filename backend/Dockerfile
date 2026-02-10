FROM python:3.11-slim

WORKDIR /app

# Install wget for health checks
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app.py .

# Create data directory for SQLite database
RUN mkdir -p /app/data/uploads

# Environment variables
ENV DATABASE_PATH=/app/data/blog.db
ENV ADMIN_KEY=change-this-in-production
ENV FLASK_DEBUG=false
ENV PORT=5000

# Expose port (Railway uses PORT env variable)
EXPOSE ${PORT}

# Run with gunicorn for production, using PORT env variable
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT} --workers 2 --timeout 30 app:app"]
