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
COPY llms.txt /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY locales/ /usr/share/nginx/html/locales/

# Create health check file and fix permissions
RUN echo "OK" > /usr/share/nginx/html/health && \
    chmod 644 /usr/share/nginx/html/*.txt /usr/share/nginx/html/*.xml

# Copy and setup entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Set default environment variables
ENV PORT=8080

# Expose port (Railway uses PORT env variable)
EXPOSE ${PORT}

# Use entrypoint script for cleaner startup
CMD ["/docker-entrypoint.sh"]
