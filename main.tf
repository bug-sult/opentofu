resource "exoscale_sks_cluster" "my_sks_cluster" {
  zone          = var.exoscale_zone
  name          = var.cluster_name
  service_level = var.sks_service_level
}

resource "exoscale_sks_nodepool" "my_sks_nodepool" {
  cluster_id    = exoscale_sks_cluster.my_sks_cluster.id
  zone          = exoscale_sks_cluster.my_sks_cluster.zone
  name          = "${var.cluster_name}--nodepool"
  instance_type = "standard.medium"
  size          = 1
  security_group_ids = [
    exoscale_security_group.my_sks_security_group.id
  ]
  //Securitygroups mitschicken
}

# (ad-hoc security group)
resource "exoscale_security_group" "my_sks_security_group" {
  name = "my-sks-security-group"
}

resource "exoscale_security_group_rule" "kubelet" {
  security_group_id = exoscale_security_group.my_sks_security_group.id
  description       = "Kubelet"
  type              = "INGRESS"
  protocol          = "TCP"
  start_port        = 10250
  end_port          = 10250
  # (between worker nodes only)
  user_security_group_id = exoscale_security_group.my_sks_security_group.id
}

resource "exoscale_security_group_rule" "calico_vxlan" {
  security_group_id = exoscale_security_group.my_sks_security_group.id
  description       = "VXLAN (Calico)"
  type              = "INGRESS"
  protocol          = "UDP"
  start_port        = 4789
  end_port          = 4789
  # (beetwen worker nodes only)
  user_security_group_id = exoscale_security_group.my_sks_security_group.id
}

resource "exoscale_security_group_rule" "nodeport_tcp" {
  security_group_id = exoscale_security_group.my_sks_security_group.id
  description       = "Nodeport TCP services"
  type              = "INGRESS"
  protocol          = "TCP"
  start_port        = 30000
  end_port          = 32767
  # (public)
  cidr = "0.0.0.0/0"
}

resource "exoscale_security_group_rule" "nodeport_udp" {
  security_group_id = exoscale_security_group.my_sks_security_group.id
  description       = "Nodeport UDP services"
  type              = "INGRESS"
  protocol          = "UDP"
  start_port        = 30000
  end_port          = 32767
  # (public)
  cidr = "0.0.0.0/0"
}


resource "exoscale_sks_kubeconfig" "my_sks_kubeconfig" {
  cluster_id = exoscale_sks_cluster.my_sks_cluster.id
  zone       = exoscale_sks_cluster.my_sks_cluster.zone

  user   = "kubernetes-admin"
  groups = ["system:masters"]
}

resource "local_sensitive_file" "kubeconfig" {
  filename = "./kubeconfig"
  content  = exoscale_sks_kubeconfig.my_sks_kubeconfig.kubeconfig
}


// Werden auch hier für zone und name variable machen