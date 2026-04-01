# Docker & Docker Compose Installation Guide for VPS

Follow these steps to install Docker and Docker Compose on your VPS.

## Installation on Ubuntu/Debian

### 1. Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Docker

```bash
# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package list
sudo apt update

# Install Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify Docker installation
docker --version
```

### 3. Install Docker Compose (Standalone)

```bash
# Download latest Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### 4. Configure Docker for Non-Root User (Optional but Recommended)

```bash
# Create docker group
sudo groupadd docker

# Add your user to docker group
sudo usermod -aG docker $USER

# Apply group changes
newgrp docker

# Verify (should not require sudo)
docker ps
```

### 5. Enable Docker Service

```bash
# Start Docker service
sudo systemctl start docker

# Enable auto-start on system boot
sudo systemctl enable docker

# Verify status
sudo systemctl status docker
```

## Quick Installation Script

Run this to install everything at once:

```bash
#!/bin/bash
set -e

echo "Installing Docker and Docker Compose..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Install Docker Compose standalone
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Enable and start Docker
sudo systemctl enable docker
sudo systemctl start docker

# Verify installations
echo ""
echo "✅ Installation complete!"
docker --version
docker-compose --version
```

## Verify Installation

```bash
# Check Docker
docker run hello-world

# Check Docker Compose
docker-compose --version

# Check Docker service is running
sudo systemctl status docker
```

## Troubleshooting

### "Permission denied while trying to connect to Docker daemon"
```bash
# Add current user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Then logout and log back in, or run:
exec su -l $USER
```

### "docker-compose: command not found"
```bash
# Verify installation path
which docker-compose

# If using plugin (installed with docker-ce-cli):
docker compose version

# If standalone binary needed:
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

### Repository or key errors
```bash
# Try alternative installation method
curl -sSL https://get.docker.com | sh

# Then add user to docker group
sudo usermod -aG docker $USER
```

## Next Steps

After installation, proceed with the CI/CD setup in `CI_CD_SETUP.md`:

1. Navigate to your app directory: `cd /home/app`
2. Initialize git repository
3. Create `.env` file with environment variables
4. Set GitHub secrets in your repository

Then push to main branch to trigger automatic deployment!
