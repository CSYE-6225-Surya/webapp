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

# SSL Certificate Process
1. Buy the SSL Certificate from NameCheap
2. Activate the SSL Certificate and Download the Certificate, Private and Chain Keys
3. Save those files with the names: certificate.pem, private-key.pem and certificate-chain.pem
4. Run the following command with respective aws profile, region to import the certificate:

```bash
aws acm import-certificate --certificate file://certificate.pem --private-key file://private-key.pem --certificate-chain file://certificate-chain.pem --region us-east-1
