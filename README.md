# OpenTofu GitOps Infrastructure

Vollständig automatisierte Infrastruktur mit OpenTofu (Terraform), Kubernetes und GitOps über ArgoCD. Diese Lösung demonstriert eine produktionsreife Infrastruktur mit automatischer Bereitstellung und Synchronisation.

## 🚀 Funktionen

- **Automatisierte Cluster-Erstellung** mit OpenTofu/Terraform
- **GitOps-Deployment** mit ArgoCD
- **Kontinuierliche Synchronisation** über GitHub Actions
- **Beispielanwendung** zur Demonstration
- **Keycloak Integration** über Operator (Version 26.0.7)

## 📋 Anwendungen

| Anwendung | Beschreibung | Port |
|-----------|--------------|------|
| **Example App** | Nginx Frontend + Node.js Backend Demo | 30080 |
| **ArgoCD** | GitOps-Management-Interface | 30081 |
| **Keycloak** | Identity und Access Management | 30082 |

## ⚡ Schnellstart

### 1. Repository Setup
```bash
git clone https://github.com/bug-sult/opentofu.git
cd opentofu
```

### 2. Exoscale API-Schlüssel konfigurieren

**GitHub Secrets einrichten:**
1. Repository → Settings → Secrets and variables → Actions
2. Folgende Secrets hinzufügen:
   - `EXOSCALE_API_KEY`: Ihr Exoscale API Key
   - `EXOSCALE_API_SECRET`: Ihr Exoscale API Secret

### 3. Automatische Bereitstellung

```bash
# Änderungen committen und pushen
git add .
git commit -m "Initial deployment"
git push origin main
```

**Das passiert automatisch:**
1. ✅ Kubernetes-Cluster wird auf Exoscale erstellt
2. ✅ ArgoCD wird installiert und konfiguriert
3. ✅ Keycloak Operator wird bereitgestellt (Version 26.0.7)
4. ✅ Example App wird automatisch bereitgestellt
5. ✅ URLs werden in den GitHub Actions Logs angezeigt

### 4. Zugriff auf Anwendungen

Nach der Bereitstellung finden Sie die URLs in den GitHub Actions Logs:

```
Application URLs:
ArgoCD UI: https://<node-ip>:30081
Example App: http://<node-ip>:30080
Keycloak: http://<node-ip>:30082
```

## 🔐 Standard-Anmeldedaten

| Service | Benutzername | Passwort | Hinweise |
|---------|--------------|----------|----------|
| ArgoCD | admin | Siehe Befehl* | *Siehe unten |
| Keycloak | admin | admin | Standard-Anmeldedaten |

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

## 🔄 GitOps-Workflow

1. **Code-Änderung** → Repository pushen
2. **GitHub Actions** → Terraform apply (bei Infrastruktur-Änderungen)
3. **ArgoCD** → Automatische Synchronisation der Anwendungen
4. **Kubernetes** → Rolling Updates der Services

### Neue Anwendung hinzufügen

1. **Kubernetes-Manifeste erstellen:**
```bash
mkdir kubernetes/neue-app
# Erstellen Sie namespace.yaml, deployment.yaml, service.yaml
```

2. **ArgoCD-Konfiguration erweitern:**
```hcl
# In terraform/argocd.tf
applications = [
  # ... bestehende Apps
  {
    name      = "neue-app"
    path      = "kubernetes/neue-app"
    namespace = "neue-app"
  }
]
```

3. **Automatische Bereitstellung:**
```bash
git add .
git commit -m "Add neue-app"
git push origin main
```

## 📊 Monitoring & Management

### Status überprüfen
```bash
# Alle Pods anzeigen
kubectl --kubeconfig=terraform/kubeconfig get pods --all-namespaces

# ArgoCD-Anwendungen
kubectl --kubeconfig=terraform/kubeconfig -n argocd get applications

# Example App Status
kubectl --kubeconfig=terraform/kubeconfig get pods -n example-app
```

### Logs anzeigen
```bash
# Example App Logs
kubectl --kubeconfig=terraform/kubeconfig logs -n example-app deployment/example-frontend

# ArgoCD-Logs
kubectl --kubeconfig=terraform/kubeconfig logs -n argocd deployment/argocd-server
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

### Häufige Probleme

**1. Pods starten nicht:**
```bash
kubectl --kubeconfig=terraform/kubeconfig describe pods -n <namespace>
```

**2. ArgoCD-Sync-Fehler:**
```bash
kubectl --kubeconfig=terraform/kubeconfig -n argocd describe applications
```

**3. Service nicht erreichbar:**
```bash
# Node-IP prüfen
kubectl --kubeconfig=terraform/kubeconfig get nodes -o wide

# Service-Status prüfen
kubectl --kubeconfig=terraform/kubeconfig get svc --all-namespaces
```

## 🔒 Sicherheit

- ✅ GitHub Secrets für sensible Daten
- ✅ Automatische Updates über ArgoCD
- ⚠️ Standard-Passwörter in Produktion ändern
- ⚠️ Security Groups vor Produktionseinsatz überprüfen

## 🧪 Testen der GitOps-Pipeline

### Test 1: Anwendung aktualisieren
```bash
# Ändern Sie z.B. die Replicas in kubernetes/example-app/deployment.yaml
# Committen und pushen Sie die Änderung
# ArgoCD synchronisiert automatisch
```

### Test 2: Rollback
```bash
# Über ArgoCD UI oder kubectl
kubectl --kubeconfig=terraform/kubeconfig -n argocd app rollback example-app
```

### Test 3: Status überwachen
```bash
# ArgoCD Sync Status prüfen
kubectl --kubeconfig=terraform/kubeconfig -n argocd get applications example-app -o yaml
```

## 📁 Projektstruktur

```
opentofu/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions Pipeline
├── kubernetes/
│   ├── example-app/           # Nginx Frontend + Node.js Backend Demo
│   │   ├── deployment.yaml    # Deployment Konfiguration
│   │   ├── service.yaml       # Service Konfiguration
│   │   └── namespace.yaml     # Namespace Definition
│   └── keycloak/             # Keycloak Identity Management
│       ├── operator.yaml      # Keycloak Operator (v26.0.7)
│       ├── keycloak.yaml      # Keycloak Instanz
│       ├── crds.yaml          # Custom Resource Definitions
│       ├── realm.yaml         # Realm Konfiguration
│       └── namespace.yaml     # Namespace Definition
├── terraform/
│   ├── main.tf               # Exoscale Cluster
│   ├── argocd.tf            # ArgoCD Installation + App Config
│   ├── app-values.yaml      # ArgoCD App Template
│   └── variables.tf         # Variablen
└── README.md                 # Diese Dokumentation
```

## 🚀 Nächste Schritte

1. **Monitoring hinzufügen**: Prometheus + Grafana
2. **Backup-Strategie**: Velero für Cluster-Backups
3. **CI/CD erweitern**: Automatische Tests vor Deployment
4. **Weitere Anwendungen**: Hinzufügen zusätzlicher Beispiel-Apps

## 📞 Support

Bei Fragen oder Problemen:
1. Überprüfen Sie die GitHub Actions Logs
2. Prüfen Sie ArgoCD UI für Sync-Status
3. Verwenden Sie kubectl für detaillierte Diagnose
4. Erstellen Sie ein Issue im Repository

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz - siehe LICENSE-Datei für Details.

---

**Hinweis**: Das angegebene Repository `https://github.com/schdandan/AKT-G-5.git` war nicht verfügbar. Die aktuelle Konfiguration verwendet bewährte Beispielanwendungen zur Demonstration der GitOps-Pipeline.
