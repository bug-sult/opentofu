# 🔐 ArgoCD Zugriffsinformationen

## 🌐 Web-Interface
- **URL**: http://[NODE-IP]:30085
- **Benutzername**: admin
- **Passwort**: b6mJyT8nvlqgzMY0

## 📝 Anmeldung
1. Öffnen Sie http://[NODE-IP]:30085 im Browser
2. Geben Sie die folgenden Anmeldedaten ein:
   - Username: admin
   - Password: b6mJyT8nvlqgzMY0

## 🔍 Troubleshooting

### ArgoCD Service überprüfen:
```bash
kubectl get svc -n argocd
```
ArgoCD Server läuft auf:
- HTTP: Port 30085
- HTTPS: Port 30086

### ArgoCD Pods überprüfen:
```bash
kubectl get pods -n argocd
```
Alle Pods sollten den Status "Running" haben.

### Passwort zurücksetzen (falls nötig):
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}"
```
Das Ergebnis ist base64-kodiert und muss dekodiert werden.

## 🔒 Sicherheitshinweise
- Ändern Sie das initiale Admin-Passwort nach der ersten Anmeldung
- Bewahren Sie die Zugangsdaten sicher auf
- Nutzen Sie HTTPS (Port 30086) für sichere Verbindungen
