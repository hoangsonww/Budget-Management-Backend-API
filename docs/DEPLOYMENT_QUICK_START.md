# Deployment Quick Start Guide

## Prerequisites

- Docker installed and configured
- Kubernetes cluster access (kubectl configured)
- Jenkins server with required plugins
- Docker registry credentials
- Kubernetes namespace created (`production` or `staging`)

## Initial Setup

### 1. Create Namespace

```bash
kubectl create namespace production
kubectl create namespace staging
```

### 2. Create Secrets

```bash
# Docker registry credentials
kubectl create secret docker-registry docker-registry-credentials \
  --docker-server=your-registry.io \
  --docker-username=your-username \
  --docker-password=your-password \
  --docker-email=your-email@example.com \
  -n production

# Backend application secrets (if needed)
kubectl create secret generic backend-secrets \
  --from-literal=JWT_SECRET=your-jwt-secret \
  --from-literal=MONGO_DB_PASSWORD=your-mongo-password \
  --from-literal=POSTGRES_PASSWORD=your-postgres-password \
  -n production
```

### 3. Apply ConfigMap

```bash
kubectl apply -f kubernetes/configmap.yaml -n production
```

## Deployment Strategies

### Blue-Green Deployment (Recommended for Production)

**Use Case**: Zero-downtime critical releases

```bash
# 1. Deploy both blue and green environments
kubectl apply -f kubernetes/backend-deployment-blue.yaml -n production
kubectl apply -f kubernetes/backend-deployment-green.yaml -n production
kubectl apply -f kubernetes/frontend-deployment-blue.yaml -n production
kubectl apply -f kubernetes/frontend-deployment-green.yaml -n production

# 2. Deploy services
kubectl apply -f kubernetes/backend-service-blue-green.yaml -n production
kubectl apply -f kubernetes/frontend-service-blue-green.yaml -n production

# 3. Apply supporting resources
kubectl apply -f kubernetes/hpa.yaml -n production
kubectl apply -f kubernetes/pdb.yaml -n production
kubectl apply -f kubernetes/network-policy.yaml -n production
kubectl apply -f kubernetes/ingress.yaml -n production
kubectl apply -f kubernetes/servicemonitor.yaml -n production

# 4. Verify deployment
kubectl get all -n production
kubectl get pods -n production -w

# 5. Switch traffic from blue to green (after validation)
kubectl patch service backend-service -n production \
  -p '{"spec":{"selector":{"version":"green"}}}'
kubectl patch service frontend-service -n production \
  -p '{"spec":{"selector":{"version":"green"}}}'
```

### Canary Deployment (Recommended for Testing)

**Use Case**: Gradual rollout with risk mitigation

```bash
# 1. Deploy stable version (90% traffic)
kubectl apply -f kubernetes/backend-deployment-canary-stable.yaml -n production
kubectl apply -f kubernetes/frontend-deployment-canary-stable.yaml -n production

# 2. Deploy canary version (10% traffic)
kubectl apply -f kubernetes/backend-deployment-canary.yaml -n production
kubectl apply -f kubernetes/frontend-deployment-canary.yaml -n production

# 3. Deploy services
kubectl apply -f kubernetes/backend-service-canary.yaml -n production
kubectl apply -f kubernetes/frontend-service-canary.yaml -n production

# 4. Apply supporting resources
kubectl apply -f kubernetes/hpa.yaml -n production
kubectl apply -f kubernetes/pdb.yaml -n production
kubectl apply -f kubernetes/network-policy.yaml -n production
kubectl apply -f kubernetes/ingress.yaml -n production
kubectl apply -f kubernetes/servicemonitor.yaml -n production

# 5. Monitor canary (5-10 minutes)
kubectl logs -f deployment/backend-deployment-canary -n production

# 6. Promote canary to stable (if healthy)
kubectl set image deployment/backend-deployment-stable \
  backend=your-registry/tictactoe-backend:new-version -n production
kubectl scale deployment/backend-deployment-stable --replicas=10 -n production
kubectl scale deployment/backend-deployment-canary --replicas=0 -n production
```

### Rolling Deployment (For Regular Updates)

**Use Case**: Regular feature releases

```bash
# 1. Update deployment with new image
kubectl set image deployment/backend-deployment \
  backend=your-registry/tictactoe-backend:new-version -n production

# 2. Monitor rollout
kubectl rollout status deployment/backend-deployment -n production

# 3. Verify
kubectl get pods -n production -l app=backend
```

## Using Jenkins Pipeline

### 1. Configure Jenkins

Create the following credentials in Jenkins:

- **docker-registry-credentials**: Docker registry username/password
- **kubeconfig-credentials**: Kubernetes config file
- **slack-webhook**: Slack webhook URL (optional)

### 2. Create Jenkins Pipeline Job

1. New Item → Pipeline
2. Configure parameters:
   - DEPLOYMENT_STRATEGY: choice (rolling, blue-green, canary)
   - ENVIRONMENT: choice (staging, production)
   - CANARY_PERCENTAGE: string (default: 10)
   - RUN_SMOKE_TESTS: boolean (default: true)
   - AUTO_ROLLBACK: boolean (default: true)

3. Pipeline script from SCM:
   - SCM: Git
   - Repository URL: your-repo-url
   - Script Path: Jenkinsfile

### 3. Run Deployment

**Blue-Green Deployment:**
```
DEPLOYMENT_STRATEGY: blue-green
ENVIRONMENT: production
RUN_SMOKE_TESTS: ✓
AUTO_ROLLBACK: ✓
```

**Canary Deployment (10% traffic):**
```
DEPLOYMENT_STRATEGY: canary
ENVIRONMENT: production
CANARY_PERCENTAGE: 10
RUN_SMOKE_TESTS: ✓
AUTO_ROLLBACK: ✓
```

**Rolling Deployment:**
```
DEPLOYMENT_STRATEGY: rolling
ENVIRONMENT: production
RUN_SMOKE_TESTS: ✓
AUTO_ROLLBACK: ✓
```

## Verification Steps

### 1. Check Pod Status

```bash
# List all pods
kubectl get pods -n production

# Expected output: All pods in Running state with READY 1/1
NAME                                      READY   STATUS    RESTARTS   AGE
backend-deployment-blue-xxx               1/1     Running   0          5m
backend-deployment-blue-yyy               1/1     Running   0          5m
backend-deployment-blue-zzz               1/1     Running   0          5m
```

### 2. Check Service Endpoints

```bash
kubectl get endpoints backend-service -n production
kubectl get endpoints frontend-service -n production
```

### 3. Test Health Endpoints

```bash
# Get service IP
kubectl get service backend-service -n production

# Test health endpoint
curl http://<service-ip>:3000/health
# Expected: {"status":"ok"}

curl http://<service-ip>:3000/ready
# Expected: {"status":"ready"}
```

### 4. Check HPA Status

```bash
kubectl get hpa -n production

# Expected output shows current/target metrics
NAME                  REFERENCE                         TARGETS         MINPODS   MAXPODS   REPLICAS
backend-hpa-blue      Deployment/backend-deployment-blue  15%/70%, 20%/80%  3         10        3
```

### 5. View Logs

```bash
# View logs from all backend pods
kubectl logs -f deployment/backend-deployment-blue -n production

# View logs from specific pod
kubectl logs -f <pod-name> -n production
```

## Rollback Procedures

### Blue-Green Rollback

```bash
# Switch traffic back to blue
kubectl patch service backend-service -n production \
  -p '{"spec":{"selector":{"version":"blue"}}}'
kubectl patch service frontend-service -n production \
  -p '{"spec":{"selector":{"version":"blue"}}}'
```

### Canary Rollback

```bash
# Scale down canary
kubectl scale deployment/backend-deployment-canary --replicas=0 -n production
kubectl scale deployment/frontend-deployment-canary --replicas=0 -n production

# Scale up stable to full capacity
kubectl scale deployment/backend-deployment-stable --replicas=10 -n production
kubectl scale deployment/frontend-deployment-stable --replicas=10 -n production
```

### Rolling Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/backend-deployment -n production
kubectl rollout undo deployment/frontend-deployment -n production

# Check rollback status
kubectl rollout status deployment/backend-deployment -n production
```

## Common Commands

### Deployment Management

```bash
# Get all deployments
kubectl get deployments -n production

# Describe deployment
kubectl describe deployment backend-deployment-blue -n production

# View rollout history
kubectl rollout history deployment/backend-deployment-blue -n production

# Pause rollout
kubectl rollout pause deployment/backend-deployment-blue -n production

# Resume rollout
kubectl rollout resume deployment/backend-deployment-blue -n production

# Restart deployment
kubectl rollout restart deployment/backend-deployment-blue -n production
```

### Pod Management

```bash
# List pods
kubectl get pods -n production -l app=backend

# Delete pod (will be recreated by deployment)
kubectl delete pod <pod-name> -n production

# Execute command in pod
kubectl exec -it <pod-name> -n production -- /bin/sh

# Port forward to pod
kubectl port-forward <pod-name> 3000:3000 -n production
```

### Scaling

```bash
# Manual scaling
kubectl scale deployment/backend-deployment-blue --replicas=5 -n production

# Check HPA
kubectl get hpa -n production

# Describe HPA
kubectl describe hpa backend-hpa-blue -n production
```

### Monitoring

```bash
# Watch pods
kubectl get pods -n production -w

# View events
kubectl get events -n production --sort-by='.lastTimestamp'

# Check resource usage
kubectl top pods -n production
kubectl top nodes

# View service endpoints
kubectl get endpoints -n production
```

## Monitoring and Alerts

### Prometheus Queries

Access Prometheus UI and run:

```promql
# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# Request rate
rate(http_requests_total[5m])

# Response time (95th percentile)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Pod CPU usage
container_cpu_usage_seconds_total{namespace="production"}

# Pod Memory usage
container_memory_usage_bytes{namespace="production"}
```

### Grafana Dashboards

Import dashboards for:
1. Kubernetes cluster overview
2. Pod metrics
3. Application metrics
4. Deployment status

## Troubleshooting

### Issue: Pods not starting

```bash
# Check pod events
kubectl describe pod <pod-name> -n production

# Check logs
kubectl logs <pod-name> -n production

# Common causes:
# - Image pull errors
# - Resource constraints
# - Configuration issues
```

### Issue: Service not responding

```bash
# Check service endpoints
kubectl get endpoints backend-service -n production

# Check pod readiness
kubectl get pods -n production -l app=backend

# Test from within cluster
kubectl run -it --rm debug --image=busybox --restart=Never -- wget -O- http://backend-service:3000/health
```

### Issue: High pod restarts

```bash
# Check pod status
kubectl get pods -n production

# View pod logs including previous container
kubectl logs <pod-name> -n production --previous

# Check resource limits
kubectl describe pod <pod-name> -n production | grep -A 5 Limits
```

## Next Steps

1. Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed procedures
2. Review [KUBERNETES_OVERVIEW.md](./KUBERNETES_OVERVIEW.md) for architecture details
3. Set up monitoring and alerting
4. Configure CI/CD pipeline
5. Test disaster recovery procedures
6. Document runbooks for common operations

## Support

For issues or questions:
- Check logs: `kubectl logs <pod-name> -n production`
- Review events: `kubectl get events -n production`
- Contact DevOps team
- Create issue in repository

---

Last updated: 2025-11-26
