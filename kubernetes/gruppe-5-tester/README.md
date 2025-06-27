# Gruppe-5-Tester: App-of-Apps Pattern Implementation

## 📁 Verzeichnisstruktur

```
kubernetes/
├── gruppe-5-tester/              # Hauptverzeichnis für Gruppe-5-Tester
│   ├── app-of-apps.yaml         # Haupt-ArgoCD-Application (Parent)
│   ├── child-applications/      # Verzeichnis für Child-Applications
│   │   ├── app1.yaml           # Child Application 1
│   │   └── app2.yaml           # Child Application 2
│   ├── app1/                   # Kubernetes Manifeste für App1
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── namespace.yaml
│   ├── app2/                   # Kubernetes Manifeste für App2
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── namespace.yaml
│   └── README.md               # Diese Dokumentation
```

## 🔄 App-of-Apps Pattern

Das App-of-Apps Pattern ist ein Verwaltungsmuster in ArgoCD, das die Orchestrierung mehrerer Anwendungen ermöglicht:

1. **Parent Application (app-of-apps.yaml)**
   - Verwaltet alle Child-Applications
   - Definiert in: `app-of-apps.yaml`
   - Überwacht das `child-applications/` Verzeichnis

2. **Child Applications**
   - Separate ArgoCD Applications für jede Komponente
   - Definiert in: `child-applications/*.yaml`
   - Jede Child-Application verwaltet ihre eigenen Kubernetes-Ressourcen

## 🚀 Deployment-Prozess

1. **Parent Application Deployment**
   ```bash
   kubectl apply -f kubernetes/gruppe-5-tester/app-of-apps.yaml
   ```

2. **Automatisches Child-Application Deployment**
   - ArgoCD erkennt Child-Applications im `child-applications/` Verzeichnis
   - Erstellt automatisch neue ArgoCD Applications
   - Synchronisiert Kubernetes-Ressourcen

3. **Synchronisation**
   - Parent Application überwacht Änderungen in Child-Applications
   - Child-Applications überwachen ihre jeweiligen Kubernetes-Ressourcen
   - Automatische Synchronisation bei Git-Updates

## 📊 Komponenten

### App1: Frontend Service
- Namespace: gruppe-5-tester-app1
- Deployment: Nginx-basiertes Frontend
- Service: NodePort-Zugriff

### App2: Backend Service
- Namespace: gruppe-5-tester-app2
- Deployment: Node.js Backend
- Service: ClusterIP für interne Kommunikation

## 🔧 Konfiguration

### Parent Application (app-of-apps.yaml)
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: gruppe-5-tester
  namespace: argocd
spec:
  project: default
  source:
    path: kubernetes/gruppe-5-tester/child-applications
    repoURL: https://github.com/bug-sult/opentofu.git
    targetRevision: HEAD
  destination:
    server: https://kubernetes.default.svc
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

### Child Application Beispiel
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: gruppe-5-tester-app1
  namespace: argocd
spec:
  project: default
  source:
    path: kubernetes/gruppe-5-tester/app1
    repoURL: https://github.com/bug-sult/opentofu.git
    targetRevision: HEAD
  destination:
    server: https://kubernetes.default.svc
    namespace: gruppe-5-tester-app1
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## 🔍 Monitoring

### ArgoCD UI
- Parent Application: `gruppe-5-tester`
- Child Applications:
  - `gruppe-5-tester-app1`
  - `gruppe-5-tester-app2`

### Kubernetes
```bash
# Überprüfen der Namespaces
kubectl get ns | grep gruppe-5-tester

# Überprüfen der Deployments
kubectl get deployments -n gruppe-5-tester-app1
kubectl get deployments -n gruppe-5-tester-app2

# Überprüfen der Services
kubectl get svc -n gruppe-5-tester-app1
kubectl get svc -n gruppe-5-tester-app2
```

## 🔄 Updates und Wartung

1. **Änderungen an Child-Applications**
   - Bearbeiten der Dateien im `child-applications/` Verzeichnis
   - ArgoCD erkennt Änderungen automatisch
   - Neue Applications werden erstellt/aktualisiert

2. **Kubernetes Ressourcen aktualisieren**
   - Änderungen in `app1/` oder `app2/` Verzeichnissen vornehmen
   - Child-Applications synchronisieren automatisch
   - Rollback möglich über ArgoCD UI

## ⚠️ Wichtige Hinweise

1. **Reihenfolge der Deployments**
   - Parent Application muss zuerst deployed werden
   - Child-Applications werden automatisch verwaltet

2. **Namespace-Verwaltung**
   - Jede Application hat ihren eigenen Namespace
   - Namespaces werden automatisch erstellt

3. **Ressourcen-Bereinigung**
   - `prune: true` entfernt nicht mehr benötigte Ressourcen
   - `selfHeal: true` stellt den gewünschten Zustand wieder her
