# OpenTofu Infrastructure with Movie Library and Keycloak Authentication

This repository contains the infrastructure configuration for deploying a Kubernetes cluster on Exoscale using OpenTofu with GitOps implementation using ArgoCD. It includes a Movie Library application with Keycloak authentication.

## Applications Overview

1. **Movie Library Application**
   - Frontend: React-based UI for managing movies
   - Backend: Node.js API with PostgreSQL database
   - Features:
     - Movie management (add, delete, list)
     - Rating system
     - Genre-based filtering
     - Sorting by title, rating, and year
   - Authentication via Keycloak

2. **Keycloak Authentication**
   - Secure authentication and authorization
   - OAuth2/OpenID Connect integration
   - Pre-configured realm and client
   - Test user account included

## Quick Access URLs

To get the URLs for accessing your applications:

1. Get the Node IP:
```bash
kubectl --kubeconfig=terraform/kubeconfig get nodes -o wide
```
Example output:
```
NAME               STATUS   ROLES    AGE   VERSION   INTERNAL-IP      EXTERNAL-IP      OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
pool-xxxxx-xxxxx   Ready    <none>   1h    v1.33.1   138.124.210.10   138.124.210.10   Ubuntu 24.04.2 LTS   6.8.0-60-generic   containerd://2.1.0
```
Use the EXTERNAL-IP from the output (e.g., 138.124.210.10)

2. Access URLs:
- ArgoCD UI: https://<node-ip>:30081
  - Username: admin
  - Password: Get it by running:
    ```bash
    kubectl --kubeconfig=terraform/kubeconfig -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
    ```
- Movie Library: http://<node-ip>:30083
- Keycloak: http://<node-ip>:30082
  - Admin Console: http://<node-ip>:30082/admin
  - Admin credentials: admin/admin123
  - Test user credentials: testuser/test123

3. Verify the services are running:
```bash
# Check ArgoCD service
kubectl --kubeconfig=terraform/kubeconfig get svc -n argocd argocd-server

# Check example application service
kubectl --kubeconfig=terraform/kubeconfig get svc -n example-app example-app-service

# Check if pods are running
kubectl --kubeconfig=terraform/kubeconfig get pods -n example-app
```

## Project Structure

The project includes the following components:

```
opentofu/
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions Workflow
├── kubernetes/
│   ├── movie-app/                   # Movie Library Application
│   │   ├── frontend/               # React Frontend
│   │   ├── backend/                # Node.js Backend
│   │   ├── frontend-deployment.yaml
│   │   ├── backend-deployment.yaml
│   │   └── postgres-deployment.yaml
│   ├── keycloak/                    # Keycloak Configuration
│   │   ├── namespace.yaml
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   └── example-app/                 # Example Application
├── terraform/                       # OpenTofu/Terraform Configurations
│   ├── argocd.tf                   # ArgoCD Installation
│   ├── main.tf                     # Exoscale Cluster
│   ├── variables.tf                # Variables Definition
│   ├── provider.tf                 # Provider Configuration
│   └── terraform.tfvars            # Variables Values
├── build-images.sh                  # Script to build Docker images
├── keycloak-setup.sh               # Script to configure Keycloak
└── README.md
```

## Prerequisites

1. GitHub Account
2. Exoscale Account with API credentials
3. OpenTofu/Terraform CLI (Version 1.5.0 or higher)
4. kubectl
5. Git
6. Docker (for building application images)
7. jq (for Keycloak setup script)

## Setup Instructions

### 1. Repository Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/bug-sult/opentofu.git
   cd opentofu
   ```

### 2. Build Application Images

1. Make the build script executable:
   ```bash
   chmod +x build-images.sh
   ```

2. Run the build script:
   ```bash
   ./build-images.sh
   ```

### 3. Deploy Infrastructure and Applications

1. Configure Exoscale:

1. Log into your Exoscale account
2. Navigate to IAM → API Keys
3. Create a new API Key
4. Note down:
   - API Key
   - API Secret

2. Configure GitHub Secrets:

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:
   - `EXOSCALE_API_KEY`: Your Exoscale API Key
   - `EXOSCALE_API_SECRET`: Your Exoscale API Secret

3. Configure Local Environment:

1. Create terraform.tfvars in the terraform directory:
   ```bash
   cd terraform
   ```

2. Create a file named `terraform.tfvars` with the following content:
   ```hcl
   exoscale_key    = "your-api-key"
   exoscale_secret = "your-api-secret"
   cluster_name    = "my-cluster"
   ```

4. Deploy Infrastructure:

The deployment process is automated through GitHub Actions:

1. Push your changes to the main branch:
   ```bash
   git add .
   git commit -m "Update configuration"
   git push origin main
   ```

2. The workflow will:
   - Initialize OpenTofu
   - Create the Exoscale Kubernetes cluster
   - Install ArgoCD
   - Deploy the example application

### 4. Configure Keycloak

1. Make the Keycloak setup script executable:
   ```bash
   chmod +x keycloak-setup.sh
   ```

2. Wait for Keycloak to be ready (check pod status):
   ```bash
   kubectl --kubeconfig=terraform/kubeconfig get pods -n keycloak
   ```

3. Run the Keycloak setup script:
   ```bash
   ./keycloak-setup.sh
   ```

### 5. Access Your Applications

1. Get the node IP:
   ```bash
   kubectl --kubeconfig=terraform/kubeconfig get nodes -o wide
   ```

2. Access the applications:
   - Movie Library: http://<node-ip>:30083
   - Keycloak: http://<node-ip>:30082
   - ArgoCD: https://<node-ip>:30081

3. Login to the Movie Library:
   - Username: testuser
   - Password: test123

#### Accessing ArgoCD UI

1. Get the kubeconfig:
   ```bash
   # If using GitHub Actions, the kubeconfig will be in terraform/kubeconfig
   ```

2. Port forward ArgoCD service:
   ```bash
   kubectl --kubeconfig=terraform/kubeconfig port-forward svc/argocd-server -n argocd 8080:443
   ```

3. Access ArgoCD:
   - URL: https://localhost:8080
   - Username: admin
   - Password: Get it by running:
     ```bash
     kubectl --kubeconfig=terraform/kubeconfig -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
     ```

#### Accessing Example Application

1. Get node IP:
   ```bash
   kubectl --kubeconfig=terraform/kubeconfig get nodes -o wide
   ```

2. Access the application:
   - URL: http://<node-ip>:30080
   - The example nginx application is exposed on port 30080

## Monitoring and Troubleshooting

### Check Application Status

```bash
# Check all applications
kubectl --kubeconfig=terraform/kubeconfig get pods --all-namespaces

# Check Movie Library components
kubectl --kubeconfig=terraform/kubeconfig get pods -n movie-app

# Check Keycloak
kubectl --kubeconfig=terraform/kubeconfig get pods -n keycloak

# Check ArgoCD application status
kubectl --kubeconfig=terraform/kubeconfig get applications -n argocd

# Check logs for Movie Library backend
kubectl --kubeconfig=terraform/kubeconfig logs -n movie-app deployment/movie-backend

# Check logs for Movie Library frontend
kubectl --kubeconfig=terraform/kubeconfig logs -n movie-app deployment/movie-frontend

# Check logs for Keycloak
kubectl --kubeconfig=terraform/kubeconfig logs -n keycloak deployment/keycloak
```

### Common Issues and Solutions

1. If ArgoCD sync fails:
   ```bash
   kubectl --kubeconfig=terraform/kubeconfig -n argocd get applications
   kubectl --kubeconfig=terraform/kubeconfig -n argocd describe applications example-app
   ```

2. If pods are not running:
   ```bash
   kubectl --kubeconfig=terraform/kubeconfig -n example-app describe pods
   ```

## Infrastructure Management

### Scaling the Application

1. Horizontal Scaling (number of pods):
   Edit `kubernetes/example-app/deployment.yaml`:
   ```yaml
   spec:
     replicas: 2  # Modify this number
   ```

2. Vertical Scaling (node size):
   Edit `terraform/main.tf`:
   ```hcl
   resource "exoscale_sks_nodepool" "my_sks_nodepool" {
     instance_type = "standard.medium"  # Modify instance type
     size          = 1                 # Modify number of nodes
   }
   ```

### Updating Applications

1. ArgoCD automatically syncs changes from the repository
2. To manually trigger sync:
   ```bash
   kubectl --kubeconfig=terraform/kubeconfig -n argocd get applications
   kubectl --kubeconfig=terraform/kubeconfig -n argocd app sync example-app
   ```

## Security Best Practices

1. Never commit sensitive information (API keys, secrets) to the repository
2. Use GitHub Secrets for sensitive values
3. Regularly update ArgoCD and other components
4. Review Security Group rules in terraform/main.tf

## Cleanup

To destroy the infrastructure:

```bash
cd terraform
terraform destroy -var="exoscale_key=your-key" -var="exoscale_secret=your-secret"
```

Note: This will destroy all resources including the Kubernetes cluster and all applications.
