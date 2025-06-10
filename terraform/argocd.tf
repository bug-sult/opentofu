resource "helm_release" "argo_cd" {
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
  repo_url       = "https://github.com/tahmo123/INFRA-G5.git"
  repo_path      = "kubernetes/example-app"
  app_name       = "example-app"
  app_namespace  = "example-app"
}

resource "helm_release" "argo_cd_app" {
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
    repo_url       = local.repo_url,
    repo_path      = local.repo_path,
    app_name       = local.app_name,
    app_namespace  = local.app_namespace
  })]

  depends_on = [
    helm_release.argo_cd
  ]
}
