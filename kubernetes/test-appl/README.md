# 🚀 TEST-APPL - GitOps Demo Anwendung

Diese Anwendung demonstriert den vollständigen GitOps-Workflow mit GitHub Actions und ArgoCD.

## 📋 Übersicht

- **Name**: TEST-APPL
- **Namespace**: test-appl
- **Port**: 30088 (NodePort)
- **Container**: nginx:alpine
- **Deployment**: Automatisch über GitOps

## 🔄 Automatisches Deployment

### Voraussetzungen
1. GitHub Repository mit KUBECONFIG Secret
2. ArgoCD läuft im Cluster
3. Kubernetes Cluster ist erreichbar

### Deployment-Prozess

1. **Änderungen committen und pushen:**
   ```bash
   git add .
   git commit -m "Add TEST-APPL application"
   git push origin main
   ```

2. **GitHub Actions wird automatisch ausgelöst** wenn:
   - Änderungen in `kubernetes/test-appl/` gepusht werden
   - Push auf `main` oder `master` Branch

3. **Workflow-Schritte:**
   - ✅ Code Checkout
   - ✅ kubectl Setup
   - ✅ Manifest Validierung
   - ✅ Kubernetes Deployment
   - ✅ Deployment Verification
   - ✅ ArgoCD Application Creation

## 🌐 Zugriff auf die Anwendung

Nach erfolgreichem Deployment:

```
http://[NODE-IP]:30088
```

Ersetzen Sie `[NODE-IP]` durch die IP-Adresse eines Ihrer Kubernetes Nodes.

## 📊 Monitoring

### GitHub Actions
- Überprüfen Sie den Workflow-Status in GitHub unter "Actions"
- Logs zeigen detaillierte Deployment-Informationen

### ArgoCD UI
- URL: `http://[NODE-IP]:30085`
- Anmeldedaten: admin / [ArgoCD-Password]
- Überwachen Sie die automatische Synchronisation

### Kubernetes Commands
```bash
# Pods überprüfen
kubectl get pods -n test-appl

# Service überprüfen
kubectl get svc -n test-appl

# Deployment Status
kubectl rollout status deployment/test-appl-frontend -n test-appl

# ArgoCD Application
kubectl get applications -n argocd
```

## 🔧 Anpassungen

Um die Anwendung zu modifizieren:

1. Bearbeiten Sie die Dateien in `kubernetes/test-appl/`
2. Committen und pushen Sie die Änderungen
3. GitHub Actions führt automatisch das Update durch
4. ArgoCD synchronisiert die Änderungen

## 📁 Dateien

- `namespace.yaml` - Kubernetes Namespace
- `deployment.yaml` - Deployment und ConfigMap
- `service.yaml` - NodePort Service
- `argocd-application.yaml` - ArgoCD Application Definition

## 🚨 Troubleshooting

### Häufige Probleme

1. **GitHub Actions schlägt fehl:**
   - Überprüfen Sie KUBECONFIG Secret
   - Validieren Sie Kubernetes Manifeste

2. **ArgoCD Sync Failed:**
   - Überprüfen Sie Repository URL
   - Validieren Sie Manifest-Syntax

3. **Pod startet nicht:**
   - Überprüfen Sie Container Image
   - Prüfen Sie Resource Limits

### Logs abrufen
```bash
# Pod Logs
kubectl logs -n test-appl deployment/test-appl-frontend

# ArgoCD Application Details
kubectl describe application test-appl -n argocd
```

## ✅ Erfolgskriterien

Die Anwendung ist erfolgreich deployed wenn:
- ✅ GitHub Actions Workflow erfolgreich
- ✅ Pod läuft (Status: Running)
- ✅ Service ist erreichbar
- ✅ ArgoCD Application ist synchronisiert
- ✅ Webseite ist über NodePort erreichbar

---

**Nächste Schritte:** Committen Sie alle Änderungen und pushen Sie sie, um das automatische Deployment zu starten!
