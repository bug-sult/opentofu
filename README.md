# OpenTofu Infrastructure with GitOps on Exoscale

This repository contains the infrastructure configuration for deploying a Kubernetes cluster on Exoscale using OpenTofu (an open source alternative to Terraform) with GitOps implementation using ArgoCD.

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
- ArgoCD UI: https://<node-ip>:30081 (e.g., https://138.124.210.10:30081)
  - Username: admin
  - Password: Get it by running:
    ```bash
    kubectl --kubeconfig=terraform/kubeconfig -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
    ```
- Example Application: http://<node-ip>:30080 (e.g., http://138.124.210.10:30080)

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

```
opentofu/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions Workflow
├── kubernetes/
│   └── example-app/           # Kubernetes Manifests
│       ├── namespace.yaml     # Application Namespace
│       ├── deployment.yaml    # Nginx Deployment
│       └── service.yaml       # NodePort Service
├── terraform/                 # OpenTofu/Terraform Configurations
│   ├── argocd.tf             # ArgoCD Installation
│   ├── main.tf               # Exoscale Cluster
│   ├── variables.tf          # Variables Definition
│   ├── provider.tf           # Provider Configuration
│   └── terraform.tfvars      # Variables Values (create this)
└── README.md
```

## Prerequisites

1. GitHub Account
2. Exoscale Account with API credentials
3. OpenTofu/Terraform CLI (Version 1.5.0 or higher)
4. kubectl
5. Git

## Setup Instructions

### 1. Repository Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/bug-sult/opentofu.git
   cd opentofu
   ```

### 2. Exoscale Configuration

1. Log into your Exoscale account
2. Navigate to IAM → API Keys
3. Create a new API Key
4. Note down:
   - API Key
   - API Secret

### 3. Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:
   - `EXOSCALE_API_KEY`: Your Exoscale API Key
   - `EXOSCALE_API_SECRET`: Your Exoscale API Secret

### 4. Configure Local Environment

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

### 5. Deploy Infrastructure

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

### 6. Access Your Applications

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
# Check ArgoCD application status
kubectl --kubeconfig=terraform/kubeconfig get applications -n argocd

# Check pods status
kubectl --kubeconfig=terraform/kubeconfig get pods -n example-app

# Check ArgoCD logs
kubectl --kubeconfig=terraform/kubeconfig logs -n argocd deployment/argocd-application-controller
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
