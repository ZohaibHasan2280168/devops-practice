#!/bin/bash

# ==============================================================================
# DevOps Automated Environment Setup Script
# Description: Installs Docker, Docker Compose, Git, Node.js, & System Utilities
# Author: DevOps Automation
# ==============================================================================

set -e # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting DevOps Environment Automated Setup..."

# 1. Update system packages
echo "🔄 Updating package lists..."
sudo apt-get update -y && sudo apt-get upgrade -y

# 2. Install essential system dependencies
echo "📦 Installing prerequisites (curl, wget, git, ca-certificates)..."
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    build-essential \
    htop \
    net-tools

# 3. Setup Docker Official GPG Key & Repository
echo "🐳 Setting up Docker Official Repository..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Install Docker Engine, CLI, Containerd, and Docker Compose Plugin
echo "🐳 Installing Docker Engine & Docker Compose..."
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Enable and Start Docker Service
echo "⚙️ Enabling and starting Docker daemon service..."
sudo systemctl enable docker
sudo systemctl start docker

# 6. Add Current User to Docker Group (Fixes permission denied errors without 'sudo')
echo "👤 Adding current user ($USER) to 'docker' group..."
sudo usermod -aG docker $USER

# 7. Install Node.js LTS (v18) and NPM (Optional for Dev Workflows)
echo "🟢 Installing Node.js LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 8. Verification & Status Output
echo "----------------------------------------------------"
echo "✅ DEVOPS ENVIRONMENT SETUP COMPLETE!"
echo "----------------------------------------------------"
echo "Installed Versions:"
docker --version
docker compose version
git --version
node -v
npm -v
echo "----------------------------------------------------"
echo "⚠️ IMPORTANT: Please log out and log back in (or run 'newgrp docker') to apply docker permissions without sudo!"

# 2. Script ko Executable (Chalanay ki) permission dein
# chmod +x setup-devops-env.sh
# 3. Script execute karein
# ./setup-devops-env.sh