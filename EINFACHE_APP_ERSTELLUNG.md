# 🚀 Einfache App-Erstellung ohne Scripts

## 📋 3-Schritt Prozess für neue Apps

### Schritt 1: Template kopieren
```
1. Kopiere den Ordner: kubernetes/app-templates/simple-app/
2. Benenne ihn um zu: kubernetes/DEINE-APP-NAME/
```

### Schritt 2: Platzhalter ersetzen
In allen .yaml Dateien ersetze:
- `APP_NAME_PLACEHOLDER` → `deine-app-name`
- `PORT_PLACEHOLDER` → `30089` (oder einen anderen freien Port)

### Schritt 3: Git Push
```
git add kubernetes/deine-app-name/
git commit -m "Add new app: deine-app-name"
git push origin main
```

## 🎯 Beispiel: Demo-App erstellen

### 1. Template kopieren
```
kubernetes/app-templates/simple-app/ → kubernetes/demo-simple-app/
```

### 2. Dateien bearbeiten

**namespace.yaml:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: demo-simple-app
```

**deployment.yaml:**
```yaml
# Ersetze APP_NAME_PLACEHOLDER mit demo-simple-app
# Ersetze PORT_PLACEHOLDER mit 30089
```

**service.yaml:**
```yaml
# Ersetze APP_NAME_PLACEHOLDER mit demo-simple-app  
# Ersetze PORT_PLACEHOLDER mit 30089
```

### 3. ArgoCD Application (optional)
Erstelle `demo-simple-app-argocd.yaml` im Root:
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: demo-simple-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/bug-sult/opentofu.git
    targetRevision: HEAD
    path: kubernetes/demo-simple-app
  destination:
    server: https://kubernetes.default.svc
    namespace: demo-simple-app
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

## ✅ Was passiert automatisch:

1. **GitHub Actions** erkennt Änderungen in `kubernetes/`
2. **Validiert** alle Kubernetes Manifeste
3. **Deployed** die App zum Cluster
4. **Erstellt** ArgoCD Application automatisch
5. **Überwacht** den Deployment-Status

## 🌐 Zugriff auf die App:
```
http://138.124.209.187:30089
```

## 📊 Verfügbare Ports:
- 30088: Frei
- 30089: Frei  
- 30090: Frei
- 30094-30099: Frei

## 🔧 Keycloak-Integration:
Für Apps mit Authentifizierung verwende:
```
kubernetes/app-templates/keycloak-enabled-app/
```

## 🎉 Das war's!
Keine Scripts, keine komplexen Tools - einfach kopieren, ersetzen, pushen!
