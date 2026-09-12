to script file use these commands {

# Script directory mein jayein
cd script

# Make executable permission
chmod +x setup-devops-env.sh

# Run script (Yeh Docker, Node.js, aur essential tools setup kar dega)
./setup-devops-env.sh

# Docker permissions refresh karne ke liye (Sudo bina chalane ke liye)
newgrp docker

# Verify Docker status
docker --version

}.........................................................................
