terraform {
  required_providers {
    exoscale = {
      source  = "exoscale/exoscale"
      version = "0.64.0"
    }
  }
}

provider "helm" {
  kubernetes {
    config_path = "${path.module}/kubeconfig"
  }
}

provider "exoscale" {
  key    = var.exoscale_key
  secret = var.exoscale_secret
}
