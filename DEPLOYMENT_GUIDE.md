# Kubernetes Cluster Deployment Guide mit Exoscale und ArgoCD

## Überwachung in Exoscale Console

Sie können den Fortschritt der Bereitstellung in der Exoscale Console verfolgen:

1. **Exoscale Console**: https://portal.exoscale.com/
2. **Compute** → **SKS (Scalable Kubernetes Service)**: Hier sehen Sie Ihren Cluster "Gruppe5-Test"
3. **Compute** → **Security Groups**: Hier sehen Sie die Security Group "my-sks-security-group-new-1"
4. **Compute** → **Instance Pools**: Hier sehen Sie den Nodepool "gruppe5-test-np"

## Vollständige Befehlsreihenfolge für Deployment

### 1. Vorbereitung
```bash
# In das terraform Verzeichnis wechseln
cd terraform

# Terraform initialisieren
terraform init

# Helm Repository hinzufügen
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
```

### 2. Infrastruktur bereitstellen
```bash
# Terraform Plan anzeigen (optional)
terraform plan

# Infrastruktur erstellen
terraform apply -auto-approve
```

### 3. Cluster-Zugriff konfigurieren
```bash
# Kubeconfig für kubectl konfigurieren
export KUBECONFIG=./kubeconfig

# Cluster-Status überprüfen
kubectl get nodes
kubectl get pods -A
```

### 4. ArgoCD Zugriff einrichten
```bash
# ArgoCD Admin Passwort abrufen
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# ArgoCD Service auf NodePort umstellen (für externen Zugriff)
kubectl patch svc argocd-server -n argocd -p '{"spec":{"type":"NodePort"}}'

# NodePort Port ermitteln
kubectl get svc argocd-server -n argocd
```

### 5. Externe IP für Zugriff ermitteln
```bash
# Worker Node IPs anzeigen
kubectl get nodes -o wide

# ArgoCD über Browser zugreifen:
# https://<NODE_IP>:<NODEPORT>
# Benutzername: admin
# Passwort: (aus Schritt 4)
```

### 6. Anwendungen überprüfen
```bash
# ArgoCD Anwendungen anzeigen
kubectl get applications -n argocd

# Pods in allen Namespaces anzeigen
kubectl get pods -A

# Spezifische Namespaces überprüfen
kubectl get pods -n example-app
kubectl get pods -n keycloak
```

### 7. Cleanup (falls erforderlich)
```bash
# Alle Ressourcen löschen
terraform destroy -auto-approve
```

## Wichtige Dateien

- `terraform.tfvars`: Enthält Exoscale API-Schlüssel und Cluster-Name
- `main.tf`: Hauptkonfiguration für Cluster und Nodepool
- `provider.tf`: Provider-Konfigurationen
- `argocd.tf`: ArgoCD Installation und Anwendungskonfiguration
- `app-values.yaml`: Template für ArgoCD Anwendungen
- `kubeconfig`: Wird automatisch erstellt für Cluster-Zugriff

## Troubleshooting

### Häufige Probleme:
1. **TLS-Zertifikatsfehler**: `insecure = true` in provider.tf hinzugefügt
2. **Nodepool-Namensformat**: Nur Kleinbuchstaben, Zahlen und Bindestriche erlaubt
3. **Helm-Provider**: Abhängigkeiten korrekt definiert mit `depends_on`

### Logs überprüfen:
```bash
# ArgoCD Server Logs
kubectl logs -n argocd deployment/argocd-server

# ArgoCD Application Controller Logs
kubectl logs -n argocd deployment/argocd-application-controller
```

## Aktuelle Konfiguration

- **Cluster-Name**: Gruppe5-Test
- **Zone**: at-vie-2
- **Nodepool**: 2 x standard.medium Instanzen
- **ArgoCD**: Automatisch installiert mit Apps für example-app und keycloak
- **Repository**: https://github.com/bug-sult/opentofu.git

## Status

✅ Security Group erstellt
✅ Cluster erstellt
✅ Nodepool erstellt
✅ Kubeconfig generiert
🔄 ArgoCD Installation läuft (kann 5-10 Minuten dauern)
⏳ ArgoCD Apps werden nach Installation automatisch synchronisiert
