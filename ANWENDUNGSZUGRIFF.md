# 🌐 Anwendungszugriff - Komplette Übersicht

Diese Datei enthält alle Informationen zum Zugriff auf die deployed Anwendungen.

## 🔍 Cluster-IP ermitteln

Bevor Sie auf die Anwendungen zugreifen können, müssen Sie die IP-Adresse Ihres Kubernetes-Clusters ermitteln:

```bash
# Node-IPs anzeigen
kubectl get nodes -o wide

# Oder spezifisch die externe IP
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'
```

## 📱 Anwendungsübersicht

### 1. Example App Frontend
- **URL**: `http://[NODE-IP]:30080`
- **Beschreibung**: Nginx Frontend mit API-Proxy
- **Features**: 
  - Statische Website
  - Proxy zu Backend API
  - Responsive Design

### 2. Example App Backend
- **URL**: `http://[NODE-IP]:30081`
- **Beschreibung**: Node.js Express API
- **Endpoints**:
  - `GET /` - Willkommensnachricht
  - `GET /api/status` - API Status
  - `GET /api/health` - Health Check

### 3. ArgoCD Management Interface
- **URL**: `http://[NODE-IP]:30085`
- **HTTPS**: `https://[NODE-IP]:30086`
- **Benutzername**: `admin`
- **Passwort**: `b6mJyT8nvlqgzMY0`
- **Features**:
  - GitOps Application Management
  - Sync Status Monitoring
  - Resource Visualization
  - Log Viewing

#### ArgoCD Erste Schritte:
1. Browser öffnen: `http://[NODE-IP]:30085`
2. Anmelden mit admin/b6mJyT8nvlqgzMY0
3. Applications Dashboard anzeigen
4. Sync Status der Anwendungen prüfen

### 4. Keycloak Identity Management
- **URL**: `http://[NODE-IP]:30083`
- **Admin Console**: `http://[NODE-IP]:30083/admin`
- **Realm**: `kubernetes`
- **Client ID**: `kubernetes`
- **Features**:
  - User Management
  - Role-Based Access Control
  - Single Sign-On (SSO)
  - Identity Federation

### 5. Gruppe5-Gute Custom App
- **URL**: `http://[NODE-IP]:30084`
- **Beschreibung**: Custom Frontend mit Meme-Integration
- **Features**:
  - Custom HTML/CSS Design
  - Meme Display
  - Responsive Layout

### 6. Gruppe-5-Tester (App-of-Apps)
- **App1 URL**: `http://[NODE-IP]:30091`
- **App2 URL**: `http://[NODE-IP]:30092`
- **App3 URL**: `http://[NODE-IP]:30093`
- **Beschreibung**: Demonstration des App-of-Apps Patterns
- **Features**:
  - Multi-Application Deployment
  - Hierarchical Application Management
  - Independent Scaling

## 🔧 Zugriff testen

### Schnelltest aller Services:
```bash
# Alle Services anzeigen
kubectl get svc --all-namespaces | grep NodePort

# Spezifische Service-Ports prüfen
kubectl get svc -n example-app
kubectl get svc -n gruppe5-gute
kubectl get svc -n gruppe-5-tester-app1
kubectl get svc -n gruppe-5-tester-app2
kubectl get svc -n argocd
```

### Connectivity Test:
```bash
# Node-IP ermitteln
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="ExternalIP")].address}')

# Services testen
curl -I http://$NODE_IP:30080  # Example App Frontend
curl -I http://$NODE_IP:30081  # Example App Backend
curl -I http://$NODE_IP:30084  # Gruppe5-Gute
curl -I http://$NODE_IP:30085  # ArgoCD
```

## 🚨 Troubleshooting

### Service nicht erreichbar?

1. **Node-IP prüfen**:
   ```bash
   kubectl get nodes -o wide
   ```

2. **Service Status prüfen**:
   ```bash
   kubectl get svc -n [NAMESPACE]
   ```

3. **Pod Status prüfen**:
   ```bash
   kubectl get pods -n [NAMESPACE]
   ```

4. **Security Groups prüfen**:
   - Ports 30000-32767 müssen offen sein
   - Exoscale Security Group Rules verifizieren

### ArgoCD Login-Probleme?

1. **Passwort zurücksetzen**:
   ```bash
   kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
   ```

2. **Service Status prüfen**:
   ```bash
   kubectl get svc -n argocd
   kubectl get pods -n argocd
   ```

### Anwendung zeigt Fehler?

1. **Pod Logs prüfen**:
   ```bash
   kubectl logs -n [NAMESPACE] [POD-NAME]
   ```

2. **Events prüfen**:
   ```bash
   kubectl get events -n [NAMESPACE] --sort-by='.lastTimestamp'
   ```

3. **Resource Status prüfen**:
   ```bash
   kubectl describe pod [POD-NAME] -n [NAMESPACE]
   ```

## 📊 Monitoring

### ArgoCD Dashboard
- Alle Applications im Überblick
- Sync Status und Health Status
- Resource Tree Visualization
- Event History

### Kubernetes Dashboard (optional)
```bash
# Kubernetes Dashboard installieren (falls gewünscht)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

# Token für Zugriff erstellen
kubectl create serviceaccount dashboard-admin-sa
kubectl create clusterrolebinding dashboard-admin-sa --clusterrole=cluster-admin --serviceaccount=default:dashboard-admin-sa
kubectl create token dashboard-admin-sa
```

## 🔐 Sicherheitshinweise

1. **Passwörter ändern**: Ändern Sie die Standard-Passwörter nach der ersten Anmeldung
2. **HTTPS verwenden**: Nutzen Sie HTTPS-Endpoints wo verfügbar
3. **Netzwerk-Sicherheit**: Beschränken Sie den Zugriff auf vertrauenswürdige IP-Bereiche
4. **Regelmäßige Updates**: Halten Sie alle Komponenten aktuell

## 📞 Support

Bei Problemen:
1. Prüfen Sie die Logs der entsprechenden Pods
2. Überprüfen Sie die ArgoCD Application Status
3. Konsultieren Sie die Troubleshooting-Sektion
4. Erstellen Sie ein GitHub Issue mit detaillierten Informationen

---

**Hinweis**: Ersetzen Sie `[NODE-IP]` durch die tatsächliche IP-Adresse Ihres Kubernetes-Clusters.
