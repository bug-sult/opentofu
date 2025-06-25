terraform {
  required_providers {
    exoscale = {
      source  = "exoscale/exoscale"
      version = "0.64.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

provider "helm" {
  kubernetes {
    config_path = "${path.module}/kubeconfig"
    insecure    = true
  }
}

provider "exoscale" {
  key    = var.exoscale_key
  secret = var.exoscale_secret
}
