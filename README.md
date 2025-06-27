# OpenTofu GitOps Infrastructure

[Previous content remains the same until the Applications section]

## 📋 Anwendungen

| Anwendung | Beschreibung | Port | Status |
|-----------|--------------|------|--------|
| **Example App Frontend** | Nginx Frontend mit API-Proxy | 30080 | ✅ Online |
| **Example App Backend** | Node.js Express API | 30081 | ✅ Online |
| **ArgoCD** | GitOps-Management-Interface | 30082 | ✅ Verfügbar |
| **Keycloak** | Identity und Access Management | 30083 | ✅ Verfügbar |
| **Gruppe5-Gute** | Custom Frontend mit Meme | 30084 | ✅ Deployed |
| **Gruppe-5-Tester** | App-of-Apps Pattern Demo | 30091 | ✅ Neu |

[Previous content remains the same until the Project Structure section]

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
│   ├── gruppe5-gute/         # Custom Application
│   │   ├── deployment.yaml    # App Deployment
│   │   ├── service.yaml       # Service (NodePort 30084)
│   │   └── namespace.yaml     # Namespace Definition
│   └── gruppe-5-tester/      # App-of-Apps Pattern Implementation
│       ├── app-of-apps.yaml   # Parent ArgoCD Application
│       ├── child-applications/ # Child ArgoCD Applications
│       │   ├── app1.yaml      # Frontend Application
│       │   └── app2.yaml      # Backend Application
│       ├── app1/             # Frontend Kubernetes Resources
│       │   ├── deployment.yaml
│       │   ├── service.yaml
│       │   └── namespace.yaml
│       ├── app2/             # Backend Kubernetes Resources
│       │   ├── deployment.yaml
│       │   ├── service.yaml
│       │   └── namespace.yaml
│       └── README.md         # Pattern Documentation

[Rest of the content remains the same]
