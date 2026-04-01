# CI/CD Deployment Setup Guide

This repository uses GitHub Actions to automatically deploy the application to your VPS via Docker Compose.

## Quick Setup Checklist

- [ ] Docker & Docker Compose installed on VPS (see DOCKER_INSTALLATION.md)
- [ ] `/home/app` directory exists on VPS
- [ ] `.env` file created on VPS
- [ ] GitHub Secrets configured
- [ ] SSH password working for `root@144.91.70.156`

## Prerequisites

1. **Git repository initialized** on your VPS at `/home/app`
2. **Docker and Docker Compose** installed on the VPS (see [DOCKER_INSTALLATION.md](DOCKER_INSTALLATION.md) if not installed)
3. **GitHub repository access** with admin permissions to set secrets

## VPS Setup Instructions

Run these commands on your VPS before first deployment:

```bash
# SSH into your VPS
ssh root@144.91.70.156

# 1. Create the app directory
mkdir -p /home/app
cd /home/app

# 2. Verify Docker and Docker Compose are installed
docker --version
docker-compose --version

# If Docker is not installed, see DOCKER_INSTALLATION.md

# 3. Create .env file with required environment variables
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

**Note:** The workflow will automatically initialize the git repository and pull code on first deployment. You don't need to manually run `git init` or `git pull`.

## GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

1. Go to: **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** for each:

| Secret Name | Value | Example |
|-----------|-------|---------|
| `VPS_HOST` | VPS IP or hostname | `144.91.70.156` |
| `VPS_USER` | SSH username | `root` |
| `VPS_PASSWORD` | SSH password | `your_ssh_password` |
| `VPS_DEPLOY_PATH` | Deployment directory | `/home/app` |

## How It Works

The CI/CD workflow (`/.github/workflows/deploy.yml`) does the following:

1. **Trigger**: Every push to the `main` branch triggers the workflow
2. **Build Phase**:
   - Installs Node.js dependencies
   - Runs linting (if available)
   - Builds the Next.js application
3. **Deploy Phase**:
   - Connects to VPS via SSH
   - Initializes git repository if needed
   - Pulls latest code from GitHub
   - Runs `docker-compose down` (stop old containers)
   - Runs `docker-compose pull` (get latest images)
   - Runs `docker-compose up -d --build` (start new containers)
   - Verifies deployment by showing running containers

## Manual Deployment (if needed)

If you need to deploy manually without pushing to GitHub:

```bash
# SSH into your VPS
ssh root@144.91.70.156

# Navigate to app directory
cd /home/app

# If git not initialized yet:
git init
git remote add origin https://github.com/yotakeys/sportclub-dasboard.git

# Pull latest changes
git pull origin main

# Deploy with docker-compose
sudo docker-compose down
sudo docker-compose pull
sudo docker-compose up -d --build

# Check status
sudo docker-compose ps

# View logs
sudo docker-compose logs -f
```

## Monitoring Deployments

### GitHub Actions UI
1. Go to your GitHub repository
2. Click **Actions** tab
3. View the latest workflow run
4. Check logs for each step (Build, Deploy, etc.)

### On VPS
```bash
# Check running containers
docker-compose ps

# View application logs
docker-compose logs -f app

# View database logs
docker-compose logs -f db

# Stop deployment (if needed)
docker-compose down

# Restart deployment
docker-compose up -d
```

## Troubleshooting

### Deployment fails with "Permission denied"
**Problem**: SSH or apt-get permission errors  
**Solution**:
- Ensure SSH password is correct in GitHub secrets
- Check that `/home/app` directory is accessible to `root` user
- Verify `root` user has password-based SSH login enabled

```bash
# On VPS, check SSH config
sudo grep PermitRootLogin /etc/ssh/sshd_config
# Should show: PermitRootLogin yes
# If not, edit /etc/ssh/sshd_config and restart: sudo systemctl restart ssh
```

### Containers fail to start
**Problem**: `docker-compose up` fails  
**Solution**:
```bash
# SSH to VPS and check logs
ssh root@144.91.70.156
cd /home/app

# View Docker Compose logs
docker-compose logs

# Check .env file exists
cat .env

# Check required ports are available
netstat -tlnp | grep -E '3000|5432'
```

### "fatal: not a git repository"
**Problem**: Git repo not initialized  
**Solution**: The workflow handles this automatically. Manual fix:
```bash
cd /home/app
git init
git remote add origin https://github.com/yotakeys/sportclub-dasboard.git
git pull origin main
```

### "docker-compose: command not found"
**Problem**: Docker Compose not installed  
**Solution**: See [DOCKER_INSTALLATION.md](DOCKER_INSTALLATION.md)

### Port already in use
**Problem**: Port 3000 or 5432 is in use  
**Solution**:
```bash
# Find process using port
lsof -i :3000
lsof -i :5432

# Kill process or change port in docker-compose.yml
sudo kill -9 <PID>

# Or modify ports in docker-compose.yml and restart
```

## Testing Your Setup

Before relying on automatic deployment, test the setup:

```bash
# 1. SSH to VPS
ssh root@144.91.70.156

# 2. Go to app directory
cd /home/app

# 3. Create .env if not exists
test -f .env || cat > .env << 'EOF'
POSTGRES_USER=sportclub
POSTGRES_PASSWORD=testpass123
POSTGRES_DATABASE=sportclub
AUTH_SECRET=testsecret123
AUTH_URL=http://144.91.70.156:3000/api/auth
ADMIN_EMAIL=admin@sportclub.com
ADMIN_PASSWORD=admin123
EOF

# 4. Initialize git and pull code
git init 2>/dev/null || true
git remote add origin https://github.com/yotakeys/sportclub-dasboard.git 2>/dev/null || true
git pull origin main

# 5. Test deployment
docker-compose down
docker-compose pull
docker-compose up -d --build

# 6. Wait and check status
sleep 10
docker-compose ps

# 7. Check if app is responding
curl http://localhost:3000/api/health 2>/dev/null || echo "App not ready yet"
```

## Next Steps

1. ✅ Install Docker on VPS (see DOCKER_INSTALLATION.md)
2. ✅ Create `/home/app` directory on VPS
3. ✅ Create `.env` file on VPS
4. ✅ Add GitHub Secrets to your repository
5. ✅ Push code to main branch
6. ✅ Monitor GitHub Actions for deployment

## Support

For detailed Docker installation instructions, see: [DOCKER_INSTALLATION.md](DOCKER_INSTALLATION.md)

For code changes and commits, they will automatically trigger deployments once the setup is complete.
