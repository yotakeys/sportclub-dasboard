#!/bin/bash

# Sports Club Dashboard - Ubuntu VPS Setup Script
# This script sets up nginx, SSL, and Docker for the application

set -e

DOMAIN="tridharma.yota.web.id"
EMAIL="keyisakris@gmail.com  # Change this to your email for Let's Encrypt notifications

echo "================================"
echo "SportClub Dashboard VPS Setup"
echo "================================"
echo "Domain: $DOMAIN"
echo ""

# Step 1: Update system
echo "[1/6] Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Step 2: Install nginx
echo "[2/6] Installing nginx..."
sudo apt install nginx -y

# Step 3: Install Certbot for SSL
echo "[3/6] Installing Certbot for SSL..."
sudo apt install certbot python3-certbot-nginx -y

# Step 4: Create nginx configuration
echo "[4/6] Setting up nginx configuration..."
sudo mkdir -p /etc/nginx/sites-available

# Copy nginx config
sudo tee /etc/nginx/sites-available/sportclub > /dev/null << 'NGINX_CONFIG'
upstream sportclub_backend {
    server 127.0.0.1:10001;
}

server {
    listen 80;
    listen [::]:80;
    server_name tridharma.yota.web.id www.tridharma.yota.web.id;

    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tridharma.yota.web.id www.tridharma.yota.web.id;

    # SSL certificate path (will be filled by Certbot)
    ssl_certificate /etc/letsencrypt/live/tridharma.yota.web.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tridharma.yota.web.id/privkey.pem;

    # SSL protocols and ciphers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Client body size limit
    client_max_body_size 10M;

    location / {
        proxy_pass http://sportclub_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;
}
NGINX_CONFIG

# Enable the site
sudo ln -sf /etc/nginx/sites-available/sportclub /etc/nginx/sites-enabled/

# Remove default site if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "[5/6] Testing nginx configuration..."
sudo nginx -t

# Step 5: Setup SSL certificate with Let's Encrypt
echo "[6/6] Setting up SSL certificate..."
echo ""
echo "Running Certbot to generate SSL certificate..."
echo "Make sure your domain DNS is already pointing to this server!"
echo ""

sudo certbot certonly --nginx \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --email $EMAIL \
    --agree-tos \
    --non-interactive \
    --expand

# Enable and start services
echo ""
echo "Enabling and starting services..."
sudo systemctl enable nginx
sudo systemctl enable certbot.timer
sudo systemctl start nginx
sudo systemctl start certbot.timer

# Test SSL renewal (dry run)
echo ""
echo "Testing SSL certificate auto-renewal..."
sudo certbot renew --dry-run

echo ""
echo "================================"
echo "✓ Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Deploy your Docker containers:"
echo "   docker-compose down"
echo "   docker-compose up -d"
echo ""
echo "2. Verify your application:"
echo "   https://$DOMAIN"
echo ""
echo "3. Check logs if needed:"
echo "   sudo tail -f /var/log/nginx/error.log"
echo "   sudo tail -f /var/log/nginx/access.log"
echo ""
