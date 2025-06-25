# Keycloak Zugriff und Konfiguration

## 🔐 Zugriff auf Keycloak

### Admin Console
- **URL**: `http://<node-ip>:30083/admin`
- **Benutzername**: `admin`
- **Passwort**: `admin`

### Node-IP ermitteln
```bash
kubectl get nodes -o wide
```

## 🚀 Erste Schritte

### 1. Admin Console öffnen
1. Öffnen Sie `http://<node-ip>:30083/admin` in Ihrem Browser
2. Melden Sie sich mit den Standard-Anmeldedaten an:
   - Benutzername: `admin`
   - Passwort: `admin`

### 2. Sicherheit konfigurieren
1. **Passwort ändern**: Gehen Sie zu "Manage" → "Users" → "admin" → "Credentials"
2. **2FA aktivieren**: Unter "Authentication" → "Required Actions"
3. **Admin-Benutzer sichern**: Erstellen Sie separate Admin-Accounts

### 3. Realm für Anwendungen erstellen
1. Klicken Sie auf "Master" (oben links) → "Create Realm"
2. Geben Sie einen Namen ein (z.B. "myapp")
3. Klicken Sie "Create"

### 4. Client für Example App konfigurieren
1. Wechseln Sie zu Ihrem neuen Realm
2. Gehen Sie zu "Clients" → "Create client"
3. Konfiguration:
   - **Client ID**: `example-app`
   - **Client Type**: `OpenID Connect`
   - **Valid redirect URIs**: `http://<node-ip>:30080/*`
   - **Web origins**: `http://<node-ip>:30080`

### 5. Benutzer erstellen
1. Gehen Sie zu "Users" → "Create new user"
2. Füllen Sie die Benutzerdetails aus
3. Setzen Sie unter "Credentials" ein Passwort

## 🔧 Integration mit Example App

### Frontend-Konfiguration
Die Example App ist bereits für Keycloak vorbereitet. Aktualisieren Sie die Keycloak-Konfiguration:

```javascript
// In der Frontend-App
const keycloak = new Keycloak({
  url: 'http://<node-ip>:30083',
  realm: 'myapp',
  clientId: 'example-app'
});
```

### Backend-Konfiguration
Für die Backend-Integration verwenden Sie die Keycloak-Adapter oder JWT-Validierung.

## 📋 Wichtige URLs

| Service | URL | Beschreibung |
|---------|-----|--------------|
| Admin Console | `http://<node-ip>:30083/admin` | Keycloak Administration |
| Realm Console | `http://<node-ip>:30083/realms/<realm-name>` | Realm-spezifische Konsole |
| OpenID Config | `http://<node-ip>:30083/realms/<realm-name>/.well-known/openid_configuration` | OpenID Connect Konfiguration |

## 🛠️ Troubleshooting

### Keycloak startet nicht
```bash
# Pod-Status prüfen
kubectl get pods -n keycloak

# Logs anzeigen
kubectl logs -n keycloak deployment/keycloak

# Pod-Details
kubectl describe pod -n keycloak <pod-name>
```

### Verbindungsprobleme
1. Überprüfen Sie die Node-IP: `kubectl get nodes -o wide`
2. Prüfen Sie den Service: `kubectl get svc -n keycloak`
3. Testen Sie die Erreichbarkeit: `curl http://<node-ip>:30083/health`

### Health-Check-Fehler
```bash
# Health-Endpoint testen
kubectl exec -n keycloak deployment/keycloak -- curl localhost:8080/health

# Service-Status prüfen
kubectl get endpoints -n keycloak
```

## 🔒 Produktions-Sicherheit

### Vor Produktionseinsatz
1. ✅ Admin-Passwort ändern
2. ✅ HTTPS konfigurieren
3. ✅ Datenbank-Persistierung einrichten
4. ✅ Backup-Strategie implementieren
5. ✅ Monitoring einrichten
6. ✅ Security Groups konfigurieren

### Empfohlene Konfiguration
```yaml
# Produktions-Deployment mit persistenter Datenbank
env:
- name: KC_DB
  value: "postgres"
- name: KC_DB_URL
  value: "jdbc:postgresql://postgres:5432/keycloak"
- name: KC_HOSTNAME_STRICT
  value: "true"
- name: KC_HOSTNAME_STRICT_HTTPS
  value: "true"
```

## 📚 Weitere Ressourcen

- [Keycloak Dokumentation](https://www.keycloak.org/documentation)
- [OpenID Connect Spezifikation](https://openid.net/connect/)
- [Keycloak REST API](https://www.keycloak.org/docs-api/latest/rest-api/)
