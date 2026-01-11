#!/bin/sh
set -e

# Default BLOG_API_URL if not set
BLOG_API_URL=${BLOG_API_URL:-http://localhost:5000}

# Ensure URL has http:// prefix
case "$BLOG_API_URL" in
  http://*|https://*) ;;
  *) BLOG_API_URL="http://$BLOG_API_URL" ;;
esac

# Default PORT if not set
PORT=${PORT:-8080}

export BLOG_API_URL PORT

echo "Starting nginx with:"
echo "  PORT: $PORT"
echo "  BLOG_API_URL: $BLOG_API_URL"

# Generate nginx config from template
envsubst '${BLOG_API_URL} ${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Test nginx config
nginx -t

# Start nginx
exec nginx -g 'daemon off;'
