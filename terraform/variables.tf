variable "cluster_name" {
  type        = string
  description = "Name of the cluster"
}

variable "exoscale_key" {
  type        = string
  description = "Exoscale API secret key"
}

variable "exoscale_secret" {
  type        = string
  description = "Exoscale API secret"
  sensitive   = true
}

variable "exoscale_zone" {
  type        = string
  description = "Exoscale zone to use"
  default     = "at-vie-2"
}

variable "sks_service_level" {
  type        = string
  description = "Service level for the SKS cluster"
  default     = "starter"
}