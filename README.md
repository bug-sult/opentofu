# 🚀 OpenTofu GitOps Infrastructure

Eine moderne GitOps-basierte Infrastruktur, die Terraform, Kubernetes, ArgoCD und GitHub Actions kombiniert.

## 🌟 Features

- **Infrastructure as Code** mit OpenTofu (Terraform)
- **GitOps-Workflow** mit ArgoCD
- **Automatisierte Deployments** über GitHub Actions
- **Kubernetes-Cluster** auf Exoscale SKS
- **Identity Management** mit Keycloak
- **Beispielanwendungen** zur Demonstration

## 🏗️ Infrastruktur

- **Cloud Provider**: Exoscale SKS
- **Cluster Name**: Gruppe5-Test
- **Node Pool**: 2x standard.medium Instanzen
- **Security Groups**: Konfiguriert für Kubernetes Services
- **NodePort Range**: 30000-32767

## 📋 Anwendungen

| Anwendung | Beschreibung | Port | Zugriff | Status |
|-----------|--------------|------|---------|---------|
| **Example App Frontend** | Nginx Frontend mit API-Proxy | 30080 | `http://[NODE-IP]:30080` | ✅ Online |
| **Example App Backend** | Node.js Express API | 30081 | `http://[NODE-IP]:30081` | ✅ Online |
| **ArgoCD** | GitOps-Management-Interface | 30085 | `http://[NODE-IP]:30085` | ✅ Verfügbar |
| **Keycloak** | Identity und Access Management | 30083 | `http://[NODE-IP]:30083` | ✅ Verfügbar |
| **Gruppe5-Gute** | Custom Frontend mit Meme | 30084 | `http://[NODE-IP]:30084` | ✅ Deployed |
| **Gruppe-5-Tester** | App-of-Apps Pattern Demo | 30091 | `http://[NODE-IP]:30091` | ✅ Neu |

### 🔐 Zugriffsinformationen

#### ArgoCD
- **URL**: `http://[NODE-IP]:30085`
- **Benutzername**: admin
- **Initial-Passwort**: Siehe `argocd-password.txt`
- **HTTPS**: Verfügbar über Port 30086

#### Keycloak
- **URL**: `http://[NODE-IP]:30083`
- **Admin Console**: `http://[NODE-IP]:30083/admin`
- **Realm**: kubernetes
- **Client ID**: kubernetes

## 🚀 Installation & Setup

### 1. Voraussetzungen
```bash
# OpenTofu (Terraform) Installation
brew install opentofu  # macOS
# oder
sudo snap install opentofu  # Linux

# kubectl Installation
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### 2. Infrastruktur-Deployment
```bash
# Terraform initialisieren
cd terraform
terraform init

# Infrastruktur erstellen
terraform plan
terraform apply
```

### 3. Kubernetes-Zugriff einrichten
```bash
# kubeconfig wird automatisch erstellt in:
./terraform/kubeconfig

# kubeconfig aktivieren
export KUBECONFIG=$(pwd)/terraform/kubeconfig
```

### 4. ArgoCD Installation
```bash
# ArgoCD Namespace erstellen
kubectl create namespace argocd

# ArgoCD installieren
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# NodePort Service konfigurieren
kubectl apply -f argocd-service-patch.yaml
```

## 🔄 GitOps Workflow

1. **Code-Änderungen**
   - Änderungen in `/kubernetes` pushen
   - GitHub Actions Pipeline wird automatisch getriggert

2. **Continuous Integration**
   - GitHub Actions validiert Kubernetes Manifeste
   - Erstellt/Aktualisiert ArgoCD Applications

3. **Continuous Deployment**
   - ArgoCD erkennt Änderungen
   - Synchronisiert Cluster-Status mit Git-Repository
   - Deployed Änderungen automatisch

## 🛠️ Troubleshooting

### ArgoCD Probleme
```bash
# ArgoCD Status prüfen
kubectl get pods -n argocd

# ArgoCD Application Status
kubectl get applications -n argocd

# Detaillierte App-Informationen
kubectl describe application [APP-NAME] -n argocd
```

### Anwendungs-Probleme
```bash
# Pods Status prüfen
kubectl get pods -n [NAMESPACE]

# Pod Logs ansehen
kubectl logs -n [NAMESPACE] [POD-NAME]

# Service-Endpunkte prüfen
kubectl get endpoints -n [NAMESPACE]
```

### Häufige Probleme

1. **Application Sync Failed**
   - ArgoCD UI für Details prüfen
   - Git Repository Zugriffsrechte verifizieren
   - Manifest-Syntax validieren

2. **Pod StartupError**
   - Events prüfen: `kubectl get events -n [NAMESPACE]`
   - Logs prüfen: `kubectl logs [POD] -n [NAMESPACE]`
   - Resource Limits überprüfen

3. **Service nicht erreichbar**
   - NodePort-Konfiguration prüfen
   - Security Group Rules verifizieren
   - Endpoint-Status prüfen

## 📁 Projektstruktur

```
opentofu/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions Pipeline
├── kubernetes/
│   ├── example-app/           # Nginx Frontend + Node.js Backend Demo
│   ├── keycloak/             # Keycloak Identity Management
│   ├── gruppe5-gute/         # Custom Application
│   └── gruppe-5-tester/      # App-of-Apps Pattern Implementation
├── terraform/
│   ├── main.tf               # Hauptkonfiguration
│   ├── variables.tf          # Variablendefinitionen
│   └── terraform.tfvars      # Variablenwerte
└── docs/                     # Dokumentation
```

## 📚 Weitere Dokumentation

- [Application Deployment Guide](APPLICATION_DEPLOYMENT_GUIDE.md)
- [ArgoCD Access Guide](ARGOCD_ACCESS.md)
- [Workflow Documentation](WORKFLOW_PROCESS_DOCUMENTATION.md)
- [GitHub Actions Workflow](GITHUB_ACTIONS_WORKFLOW_REVIEW.md)

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch
3. Committe deine Änderungen
4. Pushe zum Branch
5. Erstelle einen Pull Request

## 📝 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.
