# 🚀 VPS & Cloud Hosting Deployment Guide

This guide covers deploying CozyCritters to Virtual Private Servers (VPS) and cloud hosting platforms. It uses simple language and step-by-step instructions for everyone.

CozyCritters is a static Progressive Web App (PWA) that requires HTTPS for full functionality (app installation, offline mode).

## 🌊 DigitalOcean Deployment

DigitalOcean offers several ways to deploy CozyCritters. Choose the method that fits your needs and technical comfort level.

### Method 1: DigitalOcean App Platform (Easiest)

The App Platform automatically handles builds, deployments, and HTTPS certificates.

**Prerequisites:**
- DigitalOcean account
- GitHub account with your CozyCritters fork

**Steps:**

1. **Fork the repository**
   - Go to [github.com/ShiningVenus/CozyCritters](https://github.com/ShiningVenus/CozyCritters)
   - Click "Fork" to create your own copy

2. **Create an App on DigitalOcean**
   - Log into [DigitalOcean](https://digitalocean.com)
   - Go to **Apps** → **Create App**
   - Choose **GitHub** as your source
   - Select your CozyCritters fork

3. **Configure the build settings**
   - **Source Directory**: `/` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`
   - **HTTP Port**: `80` (default)

4. **Set environment variables (optional)**
   - Click **Environment Variables**
   - Add any variables from your `.env` file if needed

5. **Choose your plan**
   - **Basic**: $5/month - Good for personal use
   - **Professional**: $12/month - Better performance

6. **Deploy**
   - Click **Create Resources**
   - Wait 5-10 minutes for the build and deployment
   - Your app will be available at a `.ondigitalocean.app` domain

7. **Add custom domain (optional)**
   - Go to **Settings** → **Domains**
   - Add your domain name
   - Update your domain's DNS to point to DigitalOcean

**✅ Benefits:** Automatic HTTPS, automatic deployments, managed infrastructure
**❌ Limitations:** Less control, recurring costs

### Method 2: DigitalOcean Droplet with Docker (Intermediate)

Deploy using a virtual server with full control over the environment.

**Prerequisites:**
- DigitalOcean account
- Basic command line knowledge
- Domain name (for HTTPS)

**Steps:**

1. **Create a Droplet**
   - Go to **Droplets** → **Create Droplet**
   - Choose **Ubuntu 22.04 LTS**
   - Select size: **Basic $6/month** (1GB RAM) minimum
   - Choose a datacenter region close to your users
   - Add your SSH key or set a root password
   - Click **Create Droplet**

2. **Connect to your server**
   ```bash
   # Replace YOUR_DROPLET_IP with the actual IP
   ssh root@YOUR_DROPLET_IP
   ```

3. **Install Docker and dependencies**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   apt install docker-compose-plugin -y
   
   # Install Node.js (for building)
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install -y nodejs
   ```

4. **Clone and build CozyCritters**
   ```bash
   # Clone the repository
   git clone https://github.com/ShiningVenus/CozyCritters.git
   cd CozyCritters
   
   # Build the application
   npm install
   npm run build
   ./docker-build.sh
   ```

5. **Configure environment**
   ```bash
   # Copy environment file
   cp .env.docker .env
   
   # Edit the file to set your domain and port
   nano .env
   ```
   
   Set these values in `.env`:
   ```
   PORT=3000
   DOMAIN=your-domain.com
   ```

6. **Set up HTTPS with Caddy (recommended)**
   ```bash
   # Edit docker-compose.yml to enable the reverse proxy
   nano docker-compose.yml
   ```
   
   Uncomment the reverse-proxy service section:
   ```yaml
   reverse-proxy:
     image: caddy:2-alpine
     container_name: cozy-critters-proxy
     ports:
       - "80:80"
       - "443:443"
     volumes:
       - ./docker/Caddyfile:/etc/caddy/Caddyfile:ro
       - caddy_data:/data
       - caddy_config:/config
     environment:
       - DOMAIN=${DOMAIN:-localhost}
     depends_on:
       - cozy-critters
     restart: unless-stopped
   ```
   
   And uncomment the volumes section:
   ```yaml
   volumes:
     caddy_data:
     caddy_config:
   ```

7. **Configure Caddy for your domain**
   ```bash
   # Edit the Caddyfile
   nano docker/Caddyfile
   ```
   
   Replace `your-domain.com` with your actual domain:
   ```
   your-domain.com {
       reverse_proxy cozy-critters:80
   }
   ```

8. **Start the application**
   ```bash
   docker compose up -d
   ```

9. **Configure your domain's DNS**
   - Log into your domain provider (Namecheap, GoDaddy, etc.)
   - Create an **A record** pointing to your droplet's IP address
   - Wait 5-60 minutes for DNS propagation

10. **Verify deployment**
    - Visit `https://your-domain.com`
    - The app should load with a valid SSL certificate
    - Check that PWA features work (install app, offline mode)

**✅ Benefits:** Full control, one-time setup cost, better performance
**❌ Limitations:** Requires technical knowledge, manual updates

### Method 3: DigitalOcean Droplet with Static Hosting (Advanced)

Deploy using nginx directly for maximum performance.

**Prerequisites:**
- DigitalOcean account
- Strong command line knowledge
- Domain name

**Steps:**

1. **Create and access Droplet** (same as Method 2, steps 1-2)

2. **Install nginx and certbot**
   ```bash
   apt update && apt upgrade -y
   apt install nginx certbot python3-certbot-nginx nodejs npm -y
   ```

3. **Build CozyCritters locally or on server**
   ```bash
   # Clone and build
   git clone https://github.com/ShiningVenus/CozyCritters.git
   cd CozyCritters
   npm install
   npm run build
   ```

4. **Copy files to web directory**
   ```bash
   # Remove default nginx site
   rm -rf /var/www/html/*
   
   # Copy built files
   cp -r client/dist/* /var/www/html/
   
   # Set correct permissions
   chown -R www-data:www-data /var/www/html
   chmod -R 755 /var/www/html
   ```

5. **Configure nginx**
   ```bash
   nano /etc/nginx/sites-available/cozy-critters
   ```
   
   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;
   
       # PWA support
       location / {
           try_files $uri $uri/ /index.html;
       }
   
       # Cache static assets
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   
       # Service worker
       location /sw.js {
           expires 0;
           add_header Cache-Control "no-cache, no-store, must-revalidate";
       }
   }
   ```

6. **Enable the site**
   ```bash
   ln -s /etc/nginx/sites-available/cozy-critters /etc/nginx/sites-enabled/
   rm /etc/nginx/sites-enabled/default
   nginx -t && systemctl reload nginx
   ```

7. **Get SSL certificate**
   ```bash
   certbot --nginx -d your-domain.com
   ```

8. **Configure DNS** (same as Method 2, step 9)

**✅ Benefits:** Maximum performance, fine-grained control
**❌ Limitations:** Complex setup, manual certificate renewal management

## 🌐 Other VPS Providers

The methods above work on other VPS providers with minor adjustments:

### Linode

1. **Create a Linode**
   - Choose **Ubuntu 22.04 LTS**
   - Minimum: **Nanode 1GB** ($5/month)
   - Follow DigitalOcean Method 2 or 3 instructions

2. **Linode-specific considerations**
   - Use Linode's firewall to allow ports 80 and 443
   - Consider Linode Object Storage for static assets if needed

### Vultr

1. **Deploy a server**
   - Choose **Ubuntu 22.04**
   - Minimum: **Regular Performance $6/month**
   - Follow DigitalOcean Method 2 or 3 instructions

2. **Vultr-specific considerations**
   - Configure Vultr firewall for HTTP/HTTPS
   - Consider Vultr Block Storage for additional space

### AWS EC2

1. **Launch an instance**
   - Choose **Ubuntu Server 22.04 LTS**
   - Instance type: **t3.micro** (free tier) or **t3.small**
   - Configure security group to allow HTTP (80) and HTTPS (443)

2. **Connect and deploy**
   ```bash
   # Connect using your key
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Follow DigitalOcean Method 2 or 3 instructions
   # Note: Use 'ubuntu' user instead of 'root'
   sudo apt update && sudo apt upgrade -y
   # ... continue with installation
   ```

3. **AWS-specific considerations**
   - Use Elastic IP for static IP address
   - Configure Route 53 for DNS (optional)
   - Consider CloudFront CDN for better performance

### Hetzner Cloud

1. **Create a server**
   - Choose **Ubuntu 22.04**
   - Minimum: **CX11** (€3.29/month)
   - Follow DigitalOcean Method 2 or 3 instructions

2. **Hetzner-specific considerations**
   - Very cost-effective option
   - Excellent performance in Europe
   - Configure firewall rules in Hetzner console

## 🏠 Shared Hosting Deployment

Many shared hosting providers support static site hosting. This is the most affordable option but with limitations.

### Prerequisites

- Shared hosting account with file manager or FTP access
- Domain name (usually included)

### General Steps

1. **Build locally**
   ```bash
   # On your computer
   git clone https://github.com/ShiningVenus/CozyCritters.git
   cd CozyCritters
   npm install
   npm run build
   ```

2. **Upload files**
   - Use your hosting provider's file manager or FTP client
   - Upload everything from `client/dist/` folder to your `public_html` or `www` directory

3. **Configure domain**
   - If using a subdomain, create it in your hosting control panel
   - Point it to the directory containing the uploaded files

### Provider-Specific Instructions

#### cPanel Hosting (Bluehost, HostGator, etc.)

1. **Access File Manager**
   - Log into cPanel
   - Open **File Manager**
   - Navigate to `public_html` (or your domain's folder)

2. **Upload files**
   - Delete default files (index.html, etc.)
   - Upload all files from your `client/dist` folder
   - Ensure `index.html` is in the root directory

3. **Force HTTPS**
   - Go to **SSL/TLS** in cPanel
   - Enable **Force HTTPS Redirect**

#### Netlify (Static Hosting)

1. **Drag and drop deployment**
   - Go to [netlify.com](https://netlify.com)
   - Drag your `client/dist` folder to the deployment area
   - Your site will be live instantly

2. **Custom domain**
   - Go to **Domain settings**
   - Add your custom domain
   - Configure DNS as instructed

#### Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   # In your CozyCritters directory
   cd client/dist
   vercel --prod
   ```

3. **Custom domain**
   - Add domain in Vercel dashboard
   - Configure DNS as instructed

## 🔧 Domain and SSL Setup

### DNS Configuration

For any VPS deployment, you'll need to point your domain to your server:

1. **Find your server's IP address**
   ```bash
   # On your server
   curl ifconfig.me
   ```

2. **Configure DNS records**
   - **A Record**: `@` → `YOUR_SERVER_IP`
   - **CNAME Record**: `www` → `your-domain.com`

3. **Wait for propagation** (5 minutes to 24 hours)

### SSL Certificate Options

**Automatic (Recommended):**
- **Let's Encrypt with Caddy**: Automatic certificates and renewal
- **Cloudflare**: Free SSL proxy + CDN

**Manual:**
- **Certbot with nginx**: Manual setup but reliable
- **Hosting provider SSL**: Often included with shared hosting

## 🐛 Troubleshooting

### Common Issues

**1. PWA features not working**
- **Cause**: Missing HTTPS
- **Solution**: Ensure SSL certificate is properly configured
- **Test**: Check for 🔒 lock icon in browser

**2. App shows 404 errors**
- **Cause**: Server not configured for Single Page Application (SPA)
- **Solution**: Configure server to serve `index.html` for all routes
- **nginx**: Use `try_files $uri $uri/ /index.html;`

**3. Service Worker errors**
- **Cause**: Incorrect file permissions or caching
- **Solution**: Clear browser cache, check file permissions (644)

**4. Build fails on server**
- **Cause**: Insufficient memory or missing Node.js
- **Solution**: 
  - Upgrade to larger server (2GB+ RAM)
  - Build locally and upload files instead

**5. Slow loading**
- **Cause**: No asset caching or CDN
- **Solution**: 
  - Configure nginx caching
  - Use Cloudflare or similar CDN

### Performance Optimization

**For VPS deployments:**

1. **Enable gzip compression**
   ```nginx
   # Add to nginx config
   gzip on;
   gzip_types text/css text/javascript application/javascript application/json;
   ```

2. **Set cache headers**
   ```nginx
   # Static assets
   location /assets/ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **Use a CDN**
   - Cloudflare (free tier available)
   - AWS CloudFront
   - DigitalOcean Spaces CDN

## 📞 Getting Help

If you run into issues:

1. **Check the logs**
   ```bash
   # Docker deployment
   docker compose logs -f
   
   # nginx deployment
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Community support**
   - [GitHub Issues](https://github.com/ShiningVenus/CozyCritters/issues)
   - [Community Forum](../FORUMS.md)

3. **Documentation**
   - [Docker Guide](docker.md)
   - [Self-hosting Guide](self-hosting.md)
   - [FAQ](faq.md)

Remember: CozyCritters is designed to be beginner-friendly. Don't hesitate to ask for help! 🎉