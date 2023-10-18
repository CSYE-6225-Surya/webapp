packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}

variable "source_ami" {
  default = "ami-06db4d78cb1d3bbf9" # Replace with the correct Debian AMI ID.
}

variable "region" {
  default = "us-east-1" # Replace with your desired AWS region.
}

variable "subnet_id" {
  type    = string
  default = "subnet-02576640128d84c5c" # Replace with your desired AWS region.
}

variable "instance_type" {
  default = "t2.micro" # Change the instance type if needed.
}

variable "zip_file_name" {
  type    = string
  default = "../../webapp.zip"
}

source "amazon-ebs" "my-debian" {
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE 6225"
  ami_users       = ["912764834865", "889150626858"]
  source_ami      = var.source_ami
  instance_type   = var.instance_type
  ssh_username    = "admin" # Change the SSH username as needed for the AMI.
  subnet_id       = var.subnet_id
  region          = var.region
  ami_regions = [
    "us-east-1",
  ]
  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }
}

build {
  sources = ["source.amazon-ebs.my-debian"]
  provisioner "file" {
    source      = var.zip_file_name
    destination = "/tmp/webapp.zip"
  }
  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
    inline = [
      "sudo mv /tmp/webapp.zip /opt/webapp.zip",
      "cd /opt",
      "sudo apt-get update",
      "sudo apt-get upgrade -y",
      "sudo apt-get install nginx -y",
      "sudo apt-get install unzip -y",
      "sudo apt-get install dos2unix -y",
      "sudo unzip webapp.zip -d webapp",
      "ls -l",
      "sudo chmod 755 /opt/webapp",
      "cd /opt/webapp",
      "sudo chmod +x installation.sh",
      "sudo dos2unix installation.sh",
      "./installation.sh",
      "sudo apt-get clean",
    ]
  }
}
