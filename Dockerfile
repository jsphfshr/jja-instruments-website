# Flow Phantom Website Docker Image
# Lightweight nginx server for static content

FROM nginx:alpine

# Add labels for container identification
LABEL maintainer="Flow Phantom Technologies"
LABEL description="Flow Velocity String Phantom Website"
LABEL version="1.0"

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy website files
COPY index.html /usr/share/nginx/html/
COPY doppler-phantom.html /usr/share/nginx/html/
COPY hifu-generator.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/
COPY sitemap.xml /usr/share/nginx/html/

# Create a simple health check file
RUN echo "OK" > /usr/share/nginx/html/health

# Expose port 8080
EXPOSE 8080

# nginx runs in foreground by default in this image
CMD ["nginx", "-g", "daemon off;"]
