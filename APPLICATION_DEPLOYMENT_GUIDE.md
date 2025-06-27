# 🚀 Anleitung: Neue Anwendung mit GitOps Deployment

Diese Anleitung zeigt, wie Sie eine neue Anwendung erstellen und sie automatisch über GitHub Actions und ArgoCD deployen.

## 📋 Voraussetzungen

- Kubernetes Cluster ist eingerichtet
- ArgoCD ist installiert und konfiguriert
- GitHub Repository mit entsprechenden Secrets
- kubectl ist konfiguriert

## 🔧 Schritt 1: Neue Anwendung erstellen

### 1.1 Verzeichnisstruktur anlegen

```bash
mkdir -p kubernetes/[APP-NAME]
cd kubernetes/[APP-NAME]
```

### 1.2 Kubernetes Manifeste erstellen

#### Namespace (namespace.yaml)
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: [APP-NAME]
```

#### Deployment (deployment.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: [APP-NAME]-frontend
  namespace: [APP-NAME]
spec:
  replicas: 1
  selector:
    matchLabels:
      app: [APP-NAME]-frontend
  template:
    metadata:
      labels:
        app: [APP-NAME]-frontend
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
        ports:
        - containerPort: 80
        volumeMounts:
        - name: html-content
          mountPath: /usr/share/nginx/html
        resources:
          requests:
            memory: "32Mi"
            cpu: "100m"
          limits:
            memory: "64Mi"
            cpu: "200m"
      volumes:
      - name: html-content
        configMap:
          name: [APP-NAME]-content
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: [APP-NAME]-content
  namespace: [APP-NAME]
data:
  index.html: |
    <!DOCTYPE html>
    <html>
    <head>
        <title>[APP-NAME]</title>
    </head>
    <body>
        <h1>Willkommen zu [APP-NAME]!</h1>
        <p>Diese Anwendung wurde automatisch über GitOps deployed.</p>
    </body>
    </html>
```

#### Service (service.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: [APP-NAME]-service
  namespace: [APP-NAME]
spec:
  selector:
    app: [APP-NAME]-frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
      nodePort: [UNIQUE-PORT] # z.B. 30088, 30089, etc.
  type: NodePort
```

## 🔄 Schritt 2: ArgoCD Application konfigurieren

### 2.1 ArgoCD Application erstellen (argocd-application.yaml)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: [APP-NAME]
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: https://github.com/[USERNAME]/[REPOSITORY].git
    targetRevision: HEAD
    path: kubernetes/[APP-NAME]
  destination:
    server: https://kubernetes.default.svc
    namespace: [APP-NAME]
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

### 2.2 ArgoCD Application deployen

```bash
kubectl apply -f kubernetes/[APP-NAME]/argocd-application.yaml
```

## ⚙️ Schritt 3: GitHub Actions Workflow

### 3.1 Workflow-Datei erstellen (.github/workflows/[app-name]-deploy.yml)

```yaml
name: [APP-NAME] Deployment

on:
  push:
    branches: [ main, master ]
    paths:
      - 'kubernetes/[APP-NAME]/**'
  pull_request:
    branches: [ main, master ]
    paths:
      - 'kubernetes/[APP-NAME]/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'latest'
        
    - name: Configure kubectl
      run: |
        mkdir -p $HOME/.kube
        echo "${{ secrets.KUBECONFIG }}" | base64 -d > $HOME/.kube/config
        
    - name: Validate Kubernetes manifests
      run: |
        kubectl --dry-run=client apply -f kubernetes/[APP-NAME]/
        
    - name: Deploy to Kubernetes
      if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
      run: |
        kubectl apply -f kubernetes/[APP-NAME]/namespace.yaml
        kubectl apply -f kubernetes/[APP-NAME]/deployment.yaml
        kubectl apply -f kubernetes/[APP-NAME]/service.yaml
        
    - name: Wait for deployment
      if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
      run: |
        kubectl rollout status deployment/[APP-NAME]-frontend -n [APP-NAME] --timeout=300s
        
    - name: Verify deployment
      if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
      run: |
        kubectl get pods -n [APP-NAME]
        kubectl get svc -n [APP-NAME]
        
    - name: Update ArgoCD Application
      if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
      run: |
        kubectl apply -f kubernetes/[APP-NAME]/argocd-application.yaml
```

## 🔐 Schritt 4: GitHub Secrets konfigurieren

### 4.1 Erforderliche Secrets

1. Gehen Sie zu GitHub Repository → Settings → Secrets and variables → Actions
2. Fügen Sie folgende Secrets hinzu:

- **KUBECONFIG**: Base64-kodierte kubeconfig-Datei
  ```bash
  cat ~/.kube/config | base64 -w 0
  ```

## 🚀 Schritt 5: Deployment testen

### 5.1 Änderungen committen und pushen

```bash
git add .
git commit -m "Add new application: [APP-NAME]"
git push origin main
```

### 5.2 Deployment überwachen

1. **GitHub Actions**: Überprüfen Sie den Workflow in GitHub
2. **ArgoCD UI**: Überwachen Sie die Synchronisation
3. **Kubernetes**: Überprüfen Sie die Pods und Services

```bash
# Pods überprüfen
kubectl get pods -n [APP-NAME]

# Services überprüfen
kubectl get svc -n [APP-NAME]

# ArgoCD Applications anzeigen
kubectl get applications -n argocd
```

## 🌐 Schritt 6: Anwendung aufrufen

Nach erfolgreichem Deployment ist die Anwendung erreichbar unter:
```
http://[NODE-IP]:[NODE-PORT]
```

## 🔄 Automatischer Workflow

1. **Code Push** → GitHub Repository
2. **GitHub Actions** → Validierung und Deployment
3. **ArgoCD** → Automatische Synchronisation
4. **Kubernetes** → Anwendung läuft

## 📊 Monitoring und Troubleshooting

### ArgoCD UI aufrufen
```
http://[NODE-IP]:30085
```

### Logs überprüfen
```bash
# Pod Logs
kubectl logs -n [APP-NAME] deployment/[APP-NAME]-frontend

# ArgoCD Application Status
kubectl describe application [APP-NAME] -n argocd
```

### Häufige Probleme

1. **Sync Failed**: Überprüfen Sie die Manifest-Syntax
2. **ImagePullBackOff**: Überprüfen Sie das Container-Image
3. **Service nicht erreichbar**: Überprüfen Sie NodePort-Konfiguration

## 📝 Beispiel: TEST-APPL

Ein vollständiges Beispiel finden Sie im Verzeichnis `kubernetes/test-appl/`.

---

**Hinweis**: Ersetzen Sie `[APP-NAME]`, `[USERNAME]`, `[REPOSITORY]`, `[UNIQUE-PORT]` und `[NODE-IP]` durch Ihre spezifischen Werte.
