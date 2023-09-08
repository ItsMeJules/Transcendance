# Use the official Nginx image
FROM nginx:latest

WORKDIR /workspace/front

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf  # Remove the existing nginx.conf

# Copy your custom Nginx configurations to the container
COPY nginx.conf /etc/nginx/conf.d/
COPY nginx-main.conf /etc/nginx/nginx.conf

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
