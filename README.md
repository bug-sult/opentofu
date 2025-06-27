# OpenTofu GitOps Infrastructure

Vollständig automatisierte Infrastruktur mit OpenTofu (Terraform), Kubernetes und GitOps über ArgoCD. Diese Lösung demonstriert eine produktionsreife Infrastruktur mit automatischer Bereitstellung und Synchronisation.

## 🚀 Funktionen

- **Automatisierte Cluster-Erstellung** mit OpenTofu/Terraform
- **GitOps-Deployment** mit ArgoCD
- **Kontinuierliche Synchronisation** über GitHub Actions
- **Beispielanwendung** zur Demonstration
- **Keycloak Integration** über Operator (Version 26.0.7)

## 📋 Anwendungen

| Anwendung | Beschreibung | Port | Status |
|-----------|--------------|------|--------|
| **Example App Frontend** | Nginx Frontend mit API-Proxy | 30080 | ✅ Online |
| **Example App Backend** | Node.js Express API | 30081 | ✅ Online |
| **ArgoCD** | GitOps-Management-Interface | 30082 | ✅ Verfügbar |
| **Keycloak** | Identity und Access Management | 30083 | ✅ Verfügbar |
| **Gruppe5-Gute** | Custom Frontend mit Meme | 30084 | ✅ Deployed |

## ⚡ Cluster Information

**Aktueller Cluster:**
- **Name/ID:** 70a258fc-9ac9-44ae-b7d1-a7f291dc2ade
- **Provider:** Exoscale SKS
- **Region:** at-vie-2 (Wien, Österreich)
- **Nodes:** 2x standard.medium (Ready)
- **Kubernetes Version:** v1.33.0
- **Context:** kubernetes-admin

**Worker Nodes:**
- pool-32a8f-apafs (Ready)
- pool-32a8f-gkhtm (Ready)

## 🔧 Aktuelle Deployment-Konfiguration

### Terraform-Ressourcen (✅ Erfolgreich erstellt)
- **SKS Cluster:** 70a258fc-9ac9-44ae-b7d1-a7f291dc2ade
- **Nodepool:** eab281eb-c7f6-45a2-89e9-83f123773340 (2 Nodes)
- **Security Group:** fbf1dd25-d3bf-4afc-ac0b-121fe8caaf41
- **ArgoCD:** Installiert und konfiguriert
- **ArgoCD Applications:** 3 Apps automatisch deployed

### Security Group Rules
- **Kubelet:** TCP 10250 (Node-zu-Node Kommunikation)
- **Calico VXLAN:** UDP 4789 (Container Networking)
- **NodePort TCP:** TCP 30000-32767 (Externe Services)
- **NodePort UDP:** UDP 30000-32767 (Externe Services)

## 🛠️ Problemlösung: Node-Sichtbarkeit

### Problem behoben: "Wieso sehe ich im Cluster keine Nodes?"

**Ursache:** Terraform-Abhängigkeitsproblem - ArgoCD wurde vor dem Nodepool installiert, was zu einem Deadlock führte.

**Lösung implementiert:**
1. **Abhängigkeiten korrigiert:** ArgoCD hängt jetzt vom Nodepool ab
2. **Security Group Konflikte gelöst:** Eindeutige Namen verwendet
3. **Deployment-Reihenfolge optimiert:**
   - ✅ SKS Cluster erstellen
   - ✅ Security Groups und Rules erstellen
   - ✅ Nodepool erstellen (2 Worker Nodes)
   - ✅ ArgoCD installieren (nach verfügbaren Nodes)
   - ✅ Applications deployen

**Terraform-Konfiguration angepasst:**
```hcl
# argocd.tf - Korrigierte Abhängigkeit
resource "helm_release" "argo_cd" {
  depends_on = [exoscale_sks_nodepool.my_sks_nodepool]  # Geändert!
  # ... weitere Konfiguration
}
```

## ⚡ Schnellstart

### 1. Repository Setup
```bash
git clone https://github.com/bug-sult/opentofu.git
cd opentofu
```

### 2. Exoscale API-Schlüssel konfigurieren

**Terraform-Variablen setzen:**
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Bearbeiten Sie terraform.tfvars mit Ihren Exoscale-Credentials
```

**Erforderliche Variablen:**
```hcl
exoscale_api_key    = "EXO..."
exoscale_api_secret = "..."
cluster_name        = "gruppe5-cluster"
exoscale_zone       = "at-vie-2"
```

### 3. Manuelle Bereitstellung

```bash
cd terraform
terraform init
terraform apply -auto-approve
```

**Das passiert automatisch:**
1. ✅ Kubernetes-Cluster wird auf Exoscale erstellt
2. ✅ 2 Worker-Nodes werden bereitgestellt
3. ✅ ArgoCD wird installiert und konfiguriert
4. ✅ 3 Anwendungen werden automatisch deployed:
   - example-app (Frontend + Backend)
   - keycloak (Identity Management)
   - gruppe5-gute (Custom App)

### 4. Cluster-Status überprüfen

```bash
# Nodes anzeigen
kubectl --kubeconfig=kubeconfig get nodes

# Alle Pods anzeigen
kubectl --kubeconfig=kubeconfig get pods --all-namespaces

# ArgoCD Applications
kubectl --kubeconfig=kubeconfig -n argocd get applications
```

### 5. Zugriff auf Anwendungen

```bash
# Node-IPs ermitteln
kubectl --kubeconfig=kubeconfig get nodes -o wide

# Services mit NodePorts anzeigen
kubectl --kubeconfig=kubeconfig get svc --all-namespaces | grep NodePort
```

## 🔐 Standard-Anmeldedaten

| Service | Benutzername | Passwort | Port | Hinweise |
|---------|--------------|----------|------|----------|
| ArgoCD | admin | Siehe Befehl* | 30082 | *Siehe unten |
| Keycloak | admin | admin | 30083 | Standard-Anmeldedaten |

*ArgoCD-Passwort abrufen:
```bash
kubectl --kubeconfig=terraform/kubeconfig -n argocd get secret \
  argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

## 🏗️ Architektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│ GitHub Actions  │───▶│  Exoscale SKS   │
│                 │    │                 │    │    Cluster     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ArgoCD UI     │◀───│     ArgoCD      │◀───│   Kubernetes    │
│                 │    │   Controller    │    │   Applications  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 GitHub Actions Workflow

### Automatisierte Bereitstellung aktivieren

1. **GitHub Secrets konfigurieren:**
   - Repository → Settings → Secrets and variables → Actions
   - Secrets hinzufügen:
     - `EXOSCALE_API_KEY`: Ihr Exoscale API Key
     - `EXOSCALE_API_SECRET`: Ihr Exoscale API Secret

2. **Workflow-Datei überprüfen:**
```yaml
# .github/workflows/deploy.yml
name: Deploy Infrastructure
on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
      - name: Deploy Infrastructure
        env:
          EXOSCALE_API_KEY: ${{ secrets.EXOSCALE_API_KEY }}
          EXOSCALE_API_SECRET: ${{ secrets.EXOSCALE_API_SECRET }}
        run: |
          cd terraform
          terraform init
          terraform apply -auto-approve
```

3. **Automatische Bereitstellung auslösen:**
```bash
git add .
git commit -m "Trigger automated deployment"
git push origin main
```

## 📊 Monitoring & Management

### Cluster-Status überwachen
```bash
# Node-Status
kubectl --kubeconfig=terraform/kubeconfig get nodes -o wide

# Pod-Status aller Namespaces
kubectl --kubeconfig=terraform/kubeconfig get pods --all-namespaces

# ArgoCD-Anwendungen
kubectl --kubeconfig=terraform/kubeconfig -n argocd get applications

# Services mit externen Ports
kubectl --kubeconfig=terraform/kubeconfig get svc --all-namespaces | grep NodePort
```

### ArgoCD-Management
```bash
# ArgoCD UI Port-Forward (Alternative zu NodePort)
kubectl --kubeconfig=terraform/kubeconfig port-forward svc/argocd-server -n argocd 8080:443

# ArgoCD CLI Installation und Login
argocd login <node-ip>:30082 --username admin --password <password>

# Anwendungen synchronisieren
argocd app sync example-app
argocd app sync keycloak
argocd app sync gruppe5-gute
```

## 🔧 Skalierung

### Horizontale Skalierung (Pods)
```yaml
# In kubernetes/*/deployment.yaml
spec:
  replicas: 3  # Anzahl Pods erhöhen
```

### Vertikale Skalierung (Nodes)
```hcl
# In terraform/main.tf
resource "exoscale_sks_nodepool" "my_sks_nodepool" {
  instance_type = "standard.large"  # Größere Instanzen
  size          = 3                 # Mehr Nodes
}
```

## 🛠️ Troubleshooting

### Häufige Probleme und Lösungen

**1. Keine Nodes sichtbar:**
```bash
# Problem: ArgoCD vor Nodepool installiert
# Lösung: Terraform-Abhängigkeiten korrigiert (bereits implementiert)
kubectl --kubeconfig=terraform/kubeconfig get nodes
```

**2. Pods starten nicht:**
```bash
kubectl --kubeconfig=terraform/kubeconfig describe pods -n <namespace>
kubectl --kubeconfig=terraform/kubeconfig logs -n <namespace> <pod-name>
```

**3. ArgoCD-Sync-Fehler:**
```bash
kubectl --kubeconfig=terraform/kubeconfig -n argocd describe applications
kubectl --kubeconfig=terraform/kubeconfig -n argocd logs deployment/argocd-application-controller
```

**4. Service nicht erreichbar:**
```bash
# Node-IPs prüfen
kubectl --kubeconfig=terraform/kubeconfig get nodes -o wide

# Service-Status prüfen
kubectl --kubeconfig=terraform/kubeconfig get svc --all-namespaces

# Security Groups prüfen (Ports 30000-32767 müssen offen sein)
```

**5. Terraform State-Probleme:**
```bash
# State-Lock entfernen (falls nötig)
cd terraform
terraform force-unlock <lock-id>

# State refreshen
terraform refresh
```

## 🔒 Sicherheit

### Implementierte Sicherheitsmaßnahmen
- ✅ Security Groups mit spezifischen Port-Regeln
- ✅ Node-zu-Node Kommunikation beschränkt
- ✅ Externe Zugriffe nur über NodePort-Range
- ✅ ArgoCD mit RBAC-Konfiguration
- ✅ Namespace-Isolation für Anwendungen

### Sicherheitsempfehlungen
- ⚠️ Standard-Passwörter in Produktion ändern
- ⚠️ TLS-Zertifikate für externe Services konfigurieren
- ⚠️ Network Policies für Pod-zu-Pod Kommunikation
- ⚠️ Secrets-Management mit externen Tools (Vault, etc.)

## 📁 Projektstruktur

```
opentofu/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions Pipeline
├── kubernetes/
│   ├── example-app/           # Nginx Frontend + Node.js Backend Demo
│   │   ├── deployment.yaml    # Frontend Deployment
│   │   ├── backend-deployment.yaml # Backend Deployment
│   │   ├── service.yaml       # Frontend Service (NodePort 30080)
│   │   ├── backend-service.yaml # Backend Service (NodePort 30081)
│   │   └── namespace.yaml     # Namespace Definition
│   ├── keycloak/             # Keycloak Identity Management
│   │   ├── operator.yaml      # Keycloak Operator (v26.0.7)
│   │   ├── keycloak.yaml      # Keycloak Instanz
│   │   ├── crds.yaml          # Custom Resource Definitions
│   │   ├── realm.yaml         # Realm Konfiguration
│   │   └── namespace.yaml     # Namespace Definition
│   └── gruppe5-gute/         # Custom Application
│       ├── deployment.yaml    # App Deployment
│       ├── service.yaml       # Service (NodePort 30084)
│       └── namespace.yaml     # Namespace Definition
├── terraform/
│   ├── main.tf               # Exoscale Cluster + Nodepool
│   ├── argocd.tf            # ArgoCD Installation + App Config
│   ├── app-values.yaml      # ArgoCD App Template
│   ├── variables.tf         # Variablen
│   ├── provider.tf          # Provider Konfiguration
│   └── terraform.tfvars     # Variablen-Werte (nicht in Git)
└── README.md                 # Diese Dokumentation
```

## 🚀 Nächste Schritte

1. **Monitoring hinzufügen**: Prometheus + Grafana
2. **Backup-Strategie**: Velero für Cluster-Backups
3. **CI/CD erweitern**: Automatische Tests vor Deployment
4. **Ingress Controller**: Nginx Ingress für bessere Routing
5. **Cert-Manager**: Automatische TLS-Zertifikate

## 📈 Deployment-Verlauf

### Aktuelle Version (v2.0)
- ✅ Node-Sichtbarkeitsproblem behoben
- ✅ Terraform-Abhängigkeiten korrigiert
- ✅ ArgoCD erfolgreich installiert
- ✅ 3 Anwendungen automatisch deployed
- ✅ Security Groups optimiert

### Bekannte Probleme (behoben)
- ~~Nodes nicht sichtbar~~ → **Behoben**: Abhängigkeiten korrigiert
- ~~ArgoCD Installation hängt~~ → **Behoben**: Nodepool vor ArgoCD
- ~~Security Group Namenskonflikte~~ → **Behoben**: Eindeutige Namen

## 📞 Support

Bei Fragen oder Problemen:
1. Überprüfen Sie die Terraform-Outputs
2. Prüfen Sie ArgoCD UI für Sync-Status
3. Verwenden Sie kubectl für detaillierte Diagnose
4. Überprüfen Sie die Security Group Regeln
5. Erstellen Sie ein Issue im Repository

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz - siehe LICENSE-Datei für Details.

---

**Status**: ✅ **Vollständig funktionsfähig** - Cluster mit 2 Ready Nodes, ArgoCD installiert, 3 Anwendungen deployed
