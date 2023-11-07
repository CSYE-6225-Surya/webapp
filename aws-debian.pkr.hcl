packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "subnet_id" {
  type    = string
  default = "subnet-02576640128d84c5c"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "zip_file_name" {
  type    = string
  default = ""
}

variable "block_device_name" {
  type    = string
  default = "/dev/xvda"
}

variable "volume_size" {
  type    = string
  default = "25"
}

variable "volume_type" {
  type    = string
  default = "gp2"
}

source "amazon-ebs" "my-debian" {
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE 6225"
  ami_users       = ["912764834865", "889150626858"]
  source_ami      = "${var.source_ami}"
  instance_type   = "${var.instance_type}"
  ssh_username    = "admin"
  subnet_id       = "${var.subnet_id}"
  region          = "${var.region}"
  ami_regions = [
    "us-east-1",
  ]
  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }
  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "${var.block_device_name}"
    volume_size           = "${var.volume_size}"
    volume_type           = "${var.volume_type}"
  }
}

build {
  sources = ["source.amazon-ebs.my-debian"]
  provisioner "file" {
    source      = "${var.zip_file_name}"
    destination = "/tmp/webapp.zip"
  }

  provisioner "file" {
    source      = "./webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
    inline = [
      "sudo groupadd csye6225group",
      "sudo useradd -s /bin/false -g csye6225group -d /opt -m csye6225user",
      "sudo chown -R csye6225user:csye6225group /opt"
      "sudo mv /tmp/webapp.zip /opt/webapp.zip",
      "cd /opt",
      "sudo apt-get update",
      "sudo apt-get upgrade -y",
      "sudo apt-get install unzip -y",
      "sudo apt-get install dos2unix -y",
      "sudo unzip webapp.zip -d webapp",
      "ls -l",
      "sudo chmod 755 /opt/webapp",
      "cd /opt/webapp",
      "sudo chmod +x installation.sh",
      "sudo dos2unix installation.sh",
      "./installation.sh",
      "sudo apt-get remove git -y",
      "sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service",
      "sudo apt-get clean",
    ]
  }
}
