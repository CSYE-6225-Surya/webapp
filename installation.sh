#!/bin/bash

# Update package list and upgrade existing packages
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL service and enable it on boot
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Sequelize CLI
npm install -g sequelize-cli

# Create and Alter PostgreSQL user and database
POSTGRES_PASSWORD="1234"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '$POSTGRES_PASSWORD';"
sudo -u postgres createdb cloud-db

# Change directory to your project
# Example: cd yourproject
# Install project dependencies
npm install

# Run Sequelize migrations
sequelize db:migrate

# Start your Node.js application
# Example: npm start
npm run dev
