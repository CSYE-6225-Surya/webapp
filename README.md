# webapp
NodeJS repository to run csye 6225 api calls

1. ssh: ssh -i /Users/saisu/.ssh/digitalocean root@ip

2. scp: scp -i /Users/saisu/.ssh/digitalocean -r webapp root@ip:/opt/ 

3. npm install
4. check migrations

5. *Script.sh* : 
##!/bin/bash


# Install Node.js
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

# Install project dependencies
npm install

# Run Sequelize migrations
sequelize db:migrate

# Start your Node.js application
npm run dev