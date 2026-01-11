# JJ&A Ultrasound Instruments Website Docker Image
# Lightweight nginx server for static content

FROM nginx:alpine

# Add labels for container identification
LABEL maintainer="JJ&A Ultrasound Instruments"
LABEL description="JJ&A Ultrasound Instruments Website - Precision Ultrasound Equipment"
LABEL version="1.0"

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy website files
COPY index.html /usr/share/nginx/html/
COPY doppler-phantom.html /usr/share/nginx/html/
COPY hifu-generator.html /usr/share/nginx/html/
COPY admin.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/
COPY sitemap.xml /usr/share/nginx/html/
COPY BingSiteAuth.xml /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY locales/ /usr/share/nginx/html/locales/

# Create a simple health check file
RUN echo "OK" > /usr/share/nginx/html/health

# Set default environment variables
ENV PORT=8080

# Expose port (Railway uses PORT env variable)
EXPOSE ${PORT}

# Use envsubst to substitute environment variables in nginx config at runtime
# Default BLOG_API_URL if not set, and ensure it has http:// prefix
CMD ["/bin/sh", "-c", "\
  BLOG_API_URL=${BLOG_API_URL:-http://localhost:5000}; \
  case \"$BLOG_API_URL\" in http://*|https://*) ;; *) BLOG_API_URL=\"http://$BLOG_API_URL\";; esac; \
  export BLOG_API_URL; \
  echo \"BLOG_API_URL: $BLOG_API_URL\"; \
  envsubst '${BLOG_API_URL} ${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && \
  nginx -g 'daemon off;'"]
