#!/bin/bash

# Install Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Close and reopen the terminal or reload the shell configuration
source ~/.nvm/nvm.sh   # For Bash (adjust if using a different shell)

# Install a specific Node.js version (e.g., Node.js 14)
nvm install 18

# Set Node.js 14 as the active version
nvm use 18

sudo apt update

# Install PostgreSQL
# sudo apt-get install -y postgresql postgresql-contrib
sudo apt-get install -y npm

# Start PostgreSQL service and enable it on boot
# sudo systemctl start postgresql
# sudo systemctl enable postgresql

# Install Sequelize CLI
sudo npm install -g sequelize-cli

# Create and Alter PostgreSQL user and database
# POSTGRES_PASSWORD="1234"
# sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '$POSTGRES_PASSWORD';"
# sudo -u postgres createdb cloud-db

# Change directory to your project
# Example: cd yourproject
# Install project dependencies
sudo npm install

# Run Sequelize migrations

# Start your Node.js application
# Example: npm start
# sudo npm run dev
