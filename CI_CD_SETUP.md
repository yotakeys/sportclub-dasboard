# CI/CD Deployment Setup Guide

This repository uses GitHub Actions to automatically deploy the application to your VPS via Docker Compose.

## Prerequisites

1. **Git repository initialized** on your VPS at `/home/app`
2. **Docker and Docker Compose** installed on the VPS
3. **GitHub repository access** with admin permissions to set secrets

## VPS Setup Instructions

Before the deployment workflow can work, prepare your VPS:

```bash
# SSH into your VPS
ssh root@144.91.70.156

# Navigate to deployment directory
cd /home/app

# Initialize git repository (if not already done)
git init
git remote add origin https://github.com/YOUR_USERNAME/sportclub-dashboard.git
git pull origin main

# Ensure Docker and Docker Compose are installed
docker --version
docker-compose --version

# Create .env file with required environment variables
# (The workflow assumes this file exists on the VPS)
cat > .env << 'EOF'
POSTGRES_USER=sportclub
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DATABASE=sportclub
AUTH_SECRET=your_auth_secret_here
AUTH_URL=http://144.91.70.156:3000/api/auth
ADMIN_EMAIL=admin@sportclub.com
ADMIN_PASSWORD=your_admin_password_here
EOF

chmod 600 .env
```

## GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

| Secret Name | Value | Description |
|-----------|-------|-------------|
| `VPS_HOST` | `144.91.70.156` | VPS IP address or hostname |
| `VPS_USER` | `root` | SSH username |
| `VPS_PASSWORD` | Your SSH password | SSH password for authentication |
| `VPS_DEPLOY_PATH` | `/home/app` | Path where app is deployed on VPS |

**Example:** Click "New repository secret" for each:
- Name: `VPS_HOST`, Value: `144.91.70.156`
- Name: `VPS_USER`, Value: `root`
- Name: `VPS_PASSWORD`, Value: `[your password]`
- Name: `VPS_DEPLOY_PATH`, Value: `/home/app`

## How It Works

1. **Trigger**: Every push to the `main` branch triggers the workflow
2. **Build**: 
   - Installs dependencies
   - Runs linting (optional)
   - Builds the Next.js application
3. **Deploy**:
   - Connects to VPS via SSH
   - Pulls latest code from GitHub
   - Runs `docker-compose down`
   - Runs `docker-compose up -d --build`
   - Verifies containers are running

## Workflow File

The workflow configuration is in: `.github/workflows/deploy.yml`

## Manual Deployment (if needed)

If you need to deploy manually without pushing to GitHub:

```bash
# SSH into your VPS
ssh root@144.91.70.156

# Navigate to app directory
cd /home/app

# Pull latest changes
git pull origin main

# Deploy with docker-compose
docker-compose down
docker-compose pull
docker-compose up -d --build
```

## Monitoring Deployments

1. Go to your GitHub repository
2. Click **Actions** tab
3. View the latest workflow run
4. Check logs for each step (Build, Deploy, etc.)

## Troubleshooting

### Deployment fails with "Permission denied"
- Ensure SSH credentials are correct in GitHub secrets
- Check that the VPS user has permission to access `/home/app`

### Containers fail to start
- SSH into VPS and check logs: `docker-compose logs -f`
- Verify `.env` file exists and has correct values
- Check Docker and Docker Compose are installed: `docker --version`, `docker-compose --version`

### "git pull origin main" fails
- Ensure `.git` is initialized on VPS: `cd /home/app && git status`
- Add origin if missing: `git remote add origin https://github.com/YOUR_USERNAME/sportclub-dashboard.git`

### Port conflicts
- Make sure ports 3000 (app) and 5432 (database) are available
- Check: `netstat -tlnp | grep -E '3000|5432'`

## Next Steps

1. Configure GitHub secrets (see section above)
2. Set up VPS as described
3. Push code to main branch to trigger first deployment
4. Monitor the GitHub Actions log

For questions, check the GitHub Actions logs or SSH into your VPS to manually inspect containers.
