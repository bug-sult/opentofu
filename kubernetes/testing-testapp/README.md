# 🧪 Testing-TestApp: GitHub Actions Workflow Test

Diese Anwendung demonstriert die Verwendung des bestehenden GitHub Actions Workflows (`deploy.yml`) für automatisiertes Deployment.

## 📋 Übersicht

- **Name**: testing-testapp
- **Namespace**: testing-testapp
- **Port**: 30090 (NodePort)
- **Workflow**: Bestehender `deploy.yml`

## 🔄 Workflow-Integration

Der bestehende `deploy.yml` Workflow:
1. Erkennt automatisch Änderungen in `kubernetes/testing-testapp/`
2. Verwendet Matrix-Strategie für Multi-App Deployment
3. Validiert und deployed die Anwendung

## 📁 Dateien

- `namespace.yaml` - Namespace Definition
- `deployment.yaml` - Deployment & ConfigMap mit interaktivem UI
- `service.yaml` - NodePort Service (Port 30090)
- `argocd-application.yaml` - ArgoCD Integration

## 🚀 Deployment Testen

1. **Änderungen pushen:**
   ```bash
   git add kubernetes/testing-testapp/
   git commit -m "Add testing-testapp for workflow validation"
   git push origin main
   ```

2. **Workflow überwachen:**
   - GitHub → Actions → "Kubernetes App Deployment"
   - Der Workflow erkennt automatisch die neue App

3. **Deployment verifizieren:**
   ```bash
   # Pods überprüfen
   kubectl get pods -n testing-testapp

   # Service überprüfen
   kubectl get svc -n testing-testapp

   # ArgoCD Application
   kubectl get application testing-testapp -n argocd
   ```

## 🌐 Zugriff

- **Web-Interface**: `http://[NODE-IP]:30090`
- **ArgoCD**: `http://[NODE-IP]:30085`

## ✨ Features

- 🎨 Modernes, animiertes UI-Design
- 📊 Workflow-Visualisierung
- 🔄 Live Build-Zeit Anzeige
- 🎯 Deployment-Status Übersicht

## 🔍 Workflow Details

Der bestehende `deploy.yml` Workflow bietet:

1. **Automatische App-Erkennung:**
   ```yaml
   on:
     push:
       paths:
         - 'kubernetes/**'
   ```

2. **Matrix-Strategie:**
   - Erkennt geänderte Apps
   - Parallel-Deployment möglich

3. **Validierung:**
   - Dry-Run Tests
   - Manifest-Validierung
   - Resource-Checks

4. **Deployment:**
   - Namespace Creation
   - Deployment Rollout
   - Service Exposition

5. **Verifikation:**
   - Pod Status
   - Service Endpoints
   - Health Checks

6. **ArgoCD Integration:**
   - Automatische Application-Erstellung
   - Continuous Synchronization

## 📊 Monitoring

### GitHub Actions
```bash
# Workflow Status in GitHub UI
Actions → Kubernetes App Deployment → testing-testapp
```

### Kubernetes
```bash
# Pod Status
kubectl get pods -n testing-testapp

# Service Details
kubectl get svc -n testing-testapp

# Logs
kubectl logs -n testing-testapp deployment/testing-testapp-frontend
```

### ArgoCD
```bash
# Application Status
kubectl get application testing-testapp -n argocd
```

## 🔧 Troubleshooting

1. **Workflow schlägt fehl:**
   - GitHub Actions Logs prüfen
   - Manifest-Syntax validieren

2. **Pod startet nicht:**
   ```bash
   kubectl describe pod -n testing-testapp
   kubectl get events -n testing-testapp
   ```

3. **Service nicht erreichbar:**
   ```bash
   kubectl get endpoints -n testing-testapp
   kubectl describe svc testing-testapp-service -n testing-testapp
   ```

## ✅ Erfolgskriterien

- [ ] GitHub Actions Workflow erfolgreich
- [ ] Pod läuft (Status: Running)
- [ ] Service erreichbar über NodePort 30090
- [ ] ArgoCD Application synchronisiert
- [ ] Web-Interface zeigt korrekten Status

---

**Hinweis**: Diese Anwendung dient als Testfall für den bestehenden GitHub Actions Workflow und demonstriert dessen Funktionalität.
