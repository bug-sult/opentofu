resource "helm_release" "argo_cd" {
  depends_on = [exoscale_sks_nodepool.my_sks_nodepool]
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  version          = "8.0.0"
  timeout          = 1200
  create_namespace = true
  namespace        = "argocd"
  lint             = true
  wait             = true
}

locals {
  repo_url = "https://github.com/bug-sult/opentofu.git"
  
  applications = [
    {
      name      = "example-app"
      path      = "kubernetes/example-app"
      namespace = "example-app"
    },
    {
      name      = "keycloak"
      path      = "kubernetes/keycloak"
      namespace = "keycloak"
    },
    {
      name      = "gruppe5-gute"
      path      = "kubernetes/gruppe5-gute"
      namespace = "gruppe5-gute"
    }
  ]
}

resource "helm_release" "argo_cd_app" {
  depends_on = [helm_release.argo_cd]
  name             = "argocd-apps"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argocd-apps"
  version          = "1.4.1"
  timeout          = 1200
  create_namespace = false
  namespace        = "argocd"
  lint             = true
  wait             = true
  values = [templatefile("app-values.yaml", {
    repo_url      = local.repo_url,
    applications  = local.applications
  })]
}
