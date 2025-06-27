# 🚀 Test-APP-1: GitOps Demo mit GitHub Actions

Diese Anwendung demonstriert einen vollständig automatisierten GitOps-Workflow mit GitHub Actions und ArgoCD.

## 📋 Übersicht

- **Name**: Test-APP-1
- **Namespace**: test-app-1
- **Port**: 30089 (NodePort)
- **GitHub Actions**: Automatisches Deployment
- **ArgoCD**: Kontinuierliche Synchronisation

## 🔄 Automatisierter Workflow

1. **Code Push auslöst GitHub Actions:**
   - Änderungen in `kubernetes/test-app-1/`
   - Push auf `main` oder `master` Branch

2. **GitHub Actions Workflow:**
   ```yaml
   on:
     push:
       paths:
         - 'kubernetes/test-app-1/**'
   ```

3. **Automatische Schritte:**
   - ✅ Manifest-Validierung
   - ✅ Kubernetes Deployment
   - ✅ Rollout-Überwachung
   - ✅ ArgoCD Integration

## 🛠️ Komponenten

### 1. Kubernetes Manifeste
- `namespace.yaml`: Namespace Definition
- `deployment.yaml`: Deployment & ConfigMap
- `service.yaml`: NodePort Service
- `argocd-application.yaml`: ArgoCD Application

### 2. GitHub Actions Workflow
- `.github/workflows/test-app-1-deploy.yml`
- Automatische Validierung und Deployment
- Detaillierte Statusmeldungen
- Health Checks

### 3. ArgoCD Integration
- Automatische Synchronisation
- Self-Healing
- Kontinuierliches Deployment

## 🚀 Deployment

Die Anwendung wird automatisch deployed, wenn Sie Änderungen pushen:

```bash
git add kubernetes/test-app-1/
git commit -m "Update Test-APP-1"
git push origin main
```

## 🌐 Zugriff

Nach erfolgreichem Deployment:
```
http://[NODE-IP]:30089
```

## 📊 Monitoring

### GitHub Actions
- Workflow-Status in GitHub unter "Actions"
- Detaillierte Deployment-Logs

### ArgoCD UI
- URL: `http://[NODE-IP]:30085`
- Application: `test-app-1`

### Kubernetes
```bash
# Status überprüfen
kubectl get pods -n test-app-1
kubectl get svc -n test-app-1
kubectl get application test-app-1 -n argocd
```

## 🔍 Features

- 🎯 Vollautomatisches Deployment
- 🔄 Kontinuierliche Synchronisation
- 🛡️ Validierung vor Deployment
- 📊 Detaillierte Statusberichte
- 🏥 Automatische Health Checks
- 🎨 Responsive Web-Interface

## ⚙️ Technischer Stack

- **Frontend**: Nginx (Alpine)
- **Container**: Docker
- **Orchestrierung**: Kubernetes
- **CI/CD**: GitHub Actions
- **GitOps**: ArgoCD
- **Monitoring**: Kubernetes & ArgoCD

## 🔧 Ressourcen

- **CPU**: 100m (request) / 200m (limit)
- **Memory**: 32Mi (request) / 64Mi (limit)
- **Replicas**: 1

## 🚨 Troubleshooting

### Häufige Probleme

1. **Pod startet nicht:**
   ```bash
   kubectl describe pod -n test-app-1
   kubectl logs -n test-app-1 deployment/test-app-1-frontend
   ```

2. **Service nicht erreichbar:**
   ```bash
   kubectl get endpoints -n test-app-1
   kubectl describe svc test-app-1-service -n test-app-1
   ```

3. **ArgoCD Sync fehlgeschlagen:**
   ```bash
   kubectl describe application test-app-1 -n argocd
   ```

## 📝 Änderungen vornehmen

1. Bearbeiten Sie Dateien in `kubernetes/test-app-1/`
2. Committen und pushen Sie die Änderungen
3. GitHub Actions startet automatisch
4. ArgoCD synchronisiert die Änderungen

## ✅ Erfolgskriterien

- GitHub Actions Workflow erfolgreich
- Pods im Status "Running"
- Service erreichbar über NodePort
- ArgoCD Application synchronisiert
- Web-Interface zeigt aktuelle Version

---

**Repository**: https://github.com/gruppe5-gute/opentofu
**Maintainer**: Gruppe 5
