# Infrastructure as Code (IaC) mit GitOps auf Exoscale

Dieses Repository enthält die notwendige Infrastruktur-Konfiguration für die Bereitstellung eines Kubernetes-Clusters auf Exoscale mit GitOps-Implementierung durch ArgoCD.

## Projektstruktur

```
INFRA-G5/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions Workflow
├── kubernetes/
│   └── example-app/           # Kubernetes Manifeste
│       ├── namespace.yaml
│       ├── deployment.yaml
│       └── service.yaml
├── terraform/                  # Terraform Konfigurationen
│   ├── argocd.tf              # ArgoCD Installation
│   ├── main.tf                # Exoscale Cluster
│   ├── variables.tf           # Variablen Definition
│   ├── provider.tf            # Provider Konfiguration
│   └── terraform.tfvars       # Variablen Werte
└── README.md
```

## Voraussetzungen

1. GitHub Account
2. Exoscale Account
3. Terraform CLI (Version 1.5.0 oder höher)
4. kubectl
5. Git

## Einrichtungsschritte

### 1. Repository Vorbereitung

1. Klonen Sie das Repository:
   ```bash
   git clone https://github.com/tahmo123/INFRA-G5.git
   cd INFRA-G5
   ```

### 2. Exoscale Konfiguration

1. Loggen Sie sich in Ihren Exoscale Account ein
2. Navigieren Sie zu IAM → API Keys
3. Erstellen Sie einen neuen API Key
4. Notieren Sie sich:
   - API Key
   - API Secret

### 3. GitHub Secrets Konfiguration

1. Gehen Sie zu Ihrem GitHub Repository
2. Navigieren Sie zu Settings → Secrets and variables → Actions
3. Fügen Sie folgende Secrets hinzu:
   - \`EXOSCALE_API_KEY\`: Ihr Exoscale API Key
   - \`EXOSCALE_API_SECRET\`: Ihr Exoscale API Secret

### 4. Terraform Konfiguration

Die Terraform-Konfiguration ist bereits im \`terraform/\` Verzeichnis vorhanden und enthält:
- Exoscale SKS (Kubernetes) Cluster-Definition
- ArgoCD Installation via Helm
- Security Group Konfiguration
- Nodepool Konfiguration

### 5. ArgoCD Konfiguration

Die ArgoCD-Konfiguration in \`terraform/argocd.tf\` ist bereits eingerichtet für:
- Installation via Helm Chart
- Automatische Synchronisation mit dem Repository
- Deployment der Beispiel-Applikation

### 6. Deployment

Der Deployment-Prozess wird automatisch durch GitHub Actions gesteuert:

1. Push in den main Branch startet den Workflow:
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

2. Der Workflow:
   - Initialisiert Terraform
   - Erstellt den Exoscale Kubernetes Cluster
   - Installiert ArgoCD
   - Deployed die Beispiel-Applikation

### 7. Zugriff auf die Infrastruktur

1. ArgoCD UI Zugriff:
   ```bash
   kubectl --kubeconfig=terraform/kubeconfig.yaml port-forward svc/argocd-server -n argocd 8080:443
   ```
   - URL: https://localhost:8080
   - Benutzername: admin
   - Passwort: Wird am Ende des GitHub Actions Workflow angezeigt

2. Beispiel-Applikation Zugriff:
   ```bash
   # Node-IP finden
   kubectl --kubeconfig=terraform/kubeconfig.yaml get nodes -o wide
   ```
   - URL: http://<node-ip>:30080

## Komponenten im Detail

### GitHub Actions Workflow
- Automatisierte Infrastruktur-Bereitstellung
- Terraform Ausführung
- ArgoCD Installation
- Statusüberprüfung

### Terraform Konfiguration
- Exoscale SKS Cluster
- ArgoCD Helm Chart
- Security Groups
- Nodepool Management

### Kubernetes Manifeste
- Namespace Definition
- Nginx Deployment
- NodePort Service

### ArgoCD
- Automatische Synchronisation
- GitOps Workflow
- Applikations-Deployment

## Troubleshooting

### ArgoCD Sync Status prüfen
```bash
kubectl --kubeconfig=terraform/kubeconfig.yaml get applications -n argocd
```

### ArgoCD Logs anzeigen
```bash
kubectl --kubeconfig=terraform/kubeconfig.yaml logs -n argocd deployment/argocd-application-controller
```

### Pod Status überprüfen
```bash
kubectl --kubeconfig=terraform/kubeconfig.yaml get pods -n example-app
```

## Best Practices

1. **Versionskontrolle**
   - Commiten Sie alle Änderungen
   - Nutzen Sie aussagekräftige Commit-Messages
   - Verwenden Sie Feature Branches

2. **Sicherheit**
   - Speichern Sie keine Secrets im Repository
   - Nutzen Sie GitHub Secrets
   - Überprüfen Sie regelmäßig die Zugriffsrechte

3. **GitOps**
   - Alle Änderungen über Git
   - Automatische Synchronisation
   - Nachvollziehbare Änderungshistorie

## Wartung und Updates

### ArgoCD Updates
```bash
# Version in argocd.tf aktualisieren
version = "8.0.0" # Neue Version eintragen
```

### Cluster Updates
- Exoscale führt Kubernetes Updates automatisch durch
- Node Pool Updates über Terraform möglich

## Backup und Disaster Recovery

### Terraform State
- Wird lokal gespeichert
- Empfehlung: Nutzung von Terraform Cloud oder S3 Backend

### Kubernetes Ressourcen
- Durch GitOps automatisch wiederherstellbar
- Repository dient als Single Source of Truth

## Monitoring und Logging

Empfohlene zusätzliche Tools:
- Prometheus für Monitoring
- Grafana für Visualisierung
- ELK Stack für Logging

## Skalierung

### Horizontale Skalierung
```yaml
# In deployment.yaml
spec:
  replicas: 2 # Anzahl erhöhen
```

### Vertikale Skalierung
```hcl
# In terraform/main.tf
resource "exoscale_sks_nodepool" "my_sks_nodepool" {
  instance_type = "standard.medium" # Instance Typ anpassen
  size          = 1 # Anzahl der Nodes erhöhen
}
