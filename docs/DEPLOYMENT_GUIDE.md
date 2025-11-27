# Deployment Guide - Budget Management API

## Table of Contents

1. [Overview](#overview)
2. [Deployment Strategies](#deployment-strategies)
3. [Blue-Green Deployment](#blue-green-deployment)
4. [Canary Deployment](#canary-deployment)
5. [Rolling Deployment](#rolling-deployment)
6. [Jenkins Pipeline](#jenkins-pipeline)
7. [Kubernetes Configuration](#kubernetes-configuration)
8. [Monitoring and Observability](#monitoring-and-observability)
9. [Rollback Procedures](#rollback-procedures)
10. [Troubleshooting](#troubleshooting)

## Overview

This guide provides comprehensive instructions for deploying the Budget Management API to production using various deployment strategies. The application supports three deployment strategies:

- **Rolling Deployment**: Gradual replacement of old pods with new ones
- **Blue-Green Deployment**: Zero-downtime deployment with instant traffic switching
- **Canary Deployment**: Gradual traffic shift to validate new version

## Deployment Strategies

### Comparison

| Strategy | Downtime | Resource Usage | Rollback Speed | Risk Level | Use Case |
|----------|----------|----------------|----------------|------------|----------|
| Rolling | Minimal | Low | Medium | Medium | Regular updates |
| Blue-Green | Zero | High (2x) | Instant | Low | Critical releases |
| Canary | Zero | Medium | Fast | Very Low | Testing in production |

### When to Use Each Strategy

#### Rolling Deployment
- Regular feature releases
- Minor bug fixes
- When resource constraints exist
- Non-critical updates

#### Blue-Green Deployment
- Major version releases
- Database schema changes
- High-stakes releases
- When instant rollback is required

#### Canary Deployment
- Testing new features with real traffic
- Performance optimization validation
- Gradual rollout to reduce risk
- A/B testing scenarios

## Blue-Green Deployment

### Architecture

Blue-Green deployment maintains two identical production environments:
- **Blue**: Current production version
- **Green**: New version being deployed

Traffic is switched from Blue to Green only after validation passes.

### Kubernetes Manifests

```yaml
# Backend Blue Deployment
kubernetes/backend-deployment-blue.yaml

# Backend Green Deployment
kubernetes/backend-deployment-green.yaml

# Frontend Blue Deployment
kubernetes/frontend-deployment-blue.yaml

# Frontend Green Deployment
kubernetes/frontend-deployment-green.yaml

# Services for Blue-Green
kubernetes/backend-service-blue-green.yaml
kubernetes/frontend-service-blue-green.yaml
```

### Deployment Process

1. **Deploy to Inactive Environment**
   ```bash
   # If blue is active, deploy to green
   kubectl apply -f kubernetes/backend-deployment-green.yaml
   kubectl apply -f kubernetes/frontend-deployment-green.yaml
   ```

2. **Wait for Rollout**
   ```bash
   kubectl rollout status deployment/backend-deployment-green -n production
   kubectl rollout status deployment/frontend-deployment-green -n production
   ```

3. **Validate New Version**
   ```bash
   # Test the green environment using service-green endpoints
   curl http://backend-service-green:3000/health
   ```

4. **Switch Traffic**
   ```bash
   # Update service selector to point to green
   kubectl patch service backend-service -p '{"spec":{"selector":{"version":"green"}}}'
   kubectl patch service frontend-service -p '{"spec":{"selector":{"version":"green"}}}'
   ```

5. **Monitor and Verify**
   ```bash
   # Monitor logs and metrics
   kubectl logs -f deployment/backend-deployment-green -n production
   ```

6. **Scale Down Old Version**
   ```bash
   # After successful validation
   kubectl scale deployment/backend-deployment-blue --replicas=0 -n production
   kubectl scale deployment/frontend-deployment-blue --replicas=0 -n production
   ```

### Rollback

Instant rollback by switching service selector:
```bash
kubectl patch service backend-service -p '{"spec":{"selector":{"version":"blue"}}}'
kubectl patch service frontend-service -p '{"spec":{"selector":{"version":"blue"}}}'
```

## Canary Deployment

### Architecture

Canary deployment gradually shifts traffic from stable to canary version:
- **Stable**: Current production version (90% traffic)
- **Canary**: New version (10% traffic initially)

Traffic split is controlled by replica count.

### Kubernetes Manifests

```yaml
# Backend Stable Deployment (9 replicas = 90% traffic)
kubernetes/backend-deployment-canary-stable.yaml

# Backend Canary Deployment (1 replica = 10% traffic)
kubernetes/backend-deployment-canary.yaml

# Frontend Stable Deployment
kubernetes/frontend-deployment-canary-stable.yaml

# Frontend Canary Deployment
kubernetes/frontend-deployment-canary.yaml

# Services for Canary
kubernetes/backend-service-canary.yaml
kubernetes/frontend-service-canary.yaml
```

### Deployment Process

1. **Deploy Canary Version**
   ```bash
   kubectl apply -f kubernetes/backend-deployment-canary.yaml
   kubectl apply -f kubernetes/frontend-deployment-canary.yaml
   ```

2. **Scale Canary (10% traffic)**
   ```bash
   kubectl scale deployment/backend-deployment-canary --replicas=1 -n production
   kubectl scale deployment/frontend-deployment-canary --replicas=1 -n production
   kubectl scale deployment/backend-deployment-stable --replicas=9 -n production
   kubectl scale deployment/frontend-deployment-stable --replicas=9 -n production
   ```

3. **Monitor Canary**
   ```bash
   # Monitor canary metrics for 5-10 minutes
   kubectl logs -f deployment/backend-deployment-canary -n production

   # Check Prometheus metrics
   # Error rate, latency, success rate
   ```

4. **Gradually Increase Traffic**
   ```bash
   # Increase to 50% traffic
   kubectl scale deployment/backend-deployment-canary --replicas=5 -n production
   kubectl scale deployment/backend-deployment-stable --replicas=5 -n production
   ```

5. **Full Promotion**
   ```bash
   # Update stable deployment with canary image
   kubectl set image deployment/backend-deployment-stable \
     backend=your-registry/tictactoe-backend:new-version

   kubectl scale deployment/backend-deployment-stable --replicas=10 -n production
   kubectl scale deployment/backend-deployment-canary --replicas=0 -n production
   ```

### Canary Analysis Metrics

Monitor these key metrics during canary deployment:

- **Error Rate**: Should not increase
- **Response Time**: Should not degrade
- **Success Rate**: Should match stable version
- **Resource Usage**: CPU/Memory within limits
- **Custom Business Metrics**: Transaction success, user engagement

### Rollback

```bash
# Scale down canary immediately
kubectl scale deployment/backend-deployment-canary --replicas=0 -n production
kubectl scale deployment/frontend-deployment-canary --replicas=0 -n production

# Scale up stable to full capacity
kubectl scale deployment/backend-deployment-stable --replicas=10 -n production
kubectl scale deployment/frontend-deployment-stable --replicas=10 -n production
```

## Rolling Deployment

### Architecture

Rolling deployment gradually replaces old pods with new ones:
- No additional resource requirements
- Controlled rollout with `maxSurge` and `maxUnavailable`

### Deployment Process

1. **Update Deployment**
   ```bash
   kubectl set image deployment/backend-deployment \
     backend=your-registry/tictactoe-backend:new-version
   ```

2. **Monitor Rollout**
   ```bash
   kubectl rollout status deployment/backend-deployment -n production
   ```

3. **Verify**
   ```bash
   kubectl get pods -n production -w
   ```

### Rollback

```bash
kubectl rollout undo deployment/backend-deployment -n production
kubectl rollout status deployment/backend-deployment -n production
```

## Jenkins Pipeline

### Using the Pipeline

The Jenkins pipeline supports all three deployment strategies with parameters:

#### Parameters

- **DEPLOYMENT_STRATEGY**: Choose `rolling`, `blue-green`, or `canary`
- **ENVIRONMENT**: Select `staging` or `production`
- **CANARY_PERCENTAGE**: Traffic percentage for canary (1-100)
- **RUN_SMOKE_TESTS**: Enable/disable smoke tests
- **AUTO_ROLLBACK**: Enable automatic rollback on failure

#### Example Usage

1. **Blue-Green Deployment**
   ```groovy
   DEPLOYMENT_STRATEGY=blue-green
   ENVIRONMENT=production
   RUN_SMOKE_TESTS=true
   AUTO_ROLLBACK=true
   ```

2. **Canary Deployment (10% traffic)**
   ```groovy
   DEPLOYMENT_STRATEGY=canary
   ENVIRONMENT=production
   CANARY_PERCENTAGE=10
   RUN_SMOKE_TESTS=true
   AUTO_ROLLBACK=true
   ```

3. **Rolling Deployment**
   ```groovy
   DEPLOYMENT_STRATEGY=rolling
   ENVIRONMENT=production
   RUN_SMOKE_TESTS=true
   AUTO_ROLLBACK=true
   ```

### Pipeline Stages

1. **Checkout**: Clone repository
2. **Environment Setup**: Configure Node.js
3. **Install Dependencies**: npm ci
4. **Code Quality & Security**: Linting, security audit
5. **Run Tests**: Unit and integration tests
6. **Build**: Build application
7. **Build Docker Images**: Create and push Docker images
8. **Deploy**: Execute chosen deployment strategy
9. **Smoke Tests**: Validate deployment
10. **Health Check**: Verify application health
11. **Performance Tests**: Run performance validation

### Notifications

The pipeline sends Slack notifications on:
- Deployment success
- Deployment failure
- Automatic rollback triggered

Configure in Jenkinsfile:
```groovy
environment {
    SLACK_CHANNEL = '#deployments'
    SLACK_CREDENTIALS_ID = 'slack-webhook'
}
```

## Kubernetes Configuration

### Production-Ready Features

#### 1. Health Checks

All deployments include:
- **Liveness Probe**: Restarts unhealthy pods
- **Readiness Probe**: Removes unready pods from service
- **Startup Probe**: Handles slow-starting applications

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 3000
  initialDelaySeconds: 15
  periodSeconds: 5
```

#### 2. Resource Management

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

#### 3. Horizontal Pod Autoscaler (HPA)

Automatically scales based on CPU/Memory:

```yaml
# Apply HPA
kubectl apply -f kubernetes/hpa.yaml

# View HPA status
kubectl get hpa -n production
```

Configuration:
- Min replicas: 3 (5 for canary stable)
- Max replicas: 10 (20 for canary stable)
- Target CPU: 70%
- Target Memory: 80%

#### 4. Pod Disruption Budget (PDB)

Ensures minimum availability during disruptions:

```yaml
kubectl apply -f kubernetes/pdb.yaml
```

Maintains minimum 2 pods available during:
- Node maintenance
- Cluster upgrades
- Voluntary disruptions

#### 5. Network Policies

Restricts network traffic for security:

```yaml
kubectl apply -f kubernetes/network-policy.yaml
```

- Frontend can only access backend
- Backend can access databases and message queues
- DNS access allowed for all pods

#### 6. Security

All pods run with security best practices:
- Non-root user (UID 1000)
- Read-only root filesystem where possible
- Dropped capabilities
- No privilege escalation

## Monitoring and Observability

### Prometheus Integration

ServiceMonitor configured for metrics scraping:

```yaml
kubectl apply -f kubernetes/servicemonitor.yaml
```

Metrics endpoint: `/metrics` on port 3000/3001

### Grafana Dashboards

Create dashboards for:
- Request rate
- Error rate
- Response time (p50, p95, p99)
- Pod CPU/Memory usage
- Deployment status

### Logging

Centralized logging with ELK stack:
- Application logs collected by Fluentd
- Stored in Elasticsearch
- Visualized in Kibana

### Alerts

Configure alerts for:
- High error rate (> 5%)
- High response time (> 500ms p95)
- Pod restarts
- Resource exhaustion
- Failed deployments

## Rollback Procedures

### Automatic Rollback

Enabled via Jenkins parameter `AUTO_ROLLBACK=true`

Triggers on:
- Health check failures
- Smoke test failures
- Pipeline errors

### Manual Rollback

#### Blue-Green

```bash
# Switch back to previous version
kubectl patch service backend-service -p '{"spec":{"selector":{"version":"blue"}}}'
kubectl patch service frontend-service -p '{"spec":{"selector":{"version":"blue"}}}'
```

#### Canary

```bash
# Remove canary traffic
kubectl scale deployment/backend-deployment-canary --replicas=0 -n production
kubectl scale deployment/backend-deployment-stable --replicas=10 -n production
```

#### Rolling

```bash
# Rollback to previous revision
kubectl rollout undo deployment/backend-deployment -n production

# Rollback to specific revision
kubectl rollout undo deployment/backend-deployment --to-revision=3 -n production
```

### Rollback Validation

After rollback:
1. Verify pods are running
2. Check application health endpoints
3. Monitor error rates
4. Review application logs
5. Validate functionality

## Troubleshooting

### Common Issues

#### 1. ImagePullBackOff

**Symptoms**: Pods stuck in ImagePullBackOff state

**Solution**:
```bash
# Check image exists in registry
docker pull your-registry/tictactoe-backend:tag

# Verify registry credentials
kubectl get secret docker-registry-credentials -n production

# Check pod events
kubectl describe pod <pod-name> -n production
```

#### 2. CrashLoopBackOff

**Symptoms**: Pods constantly restarting

**Solution**:
```bash
# Check pod logs
kubectl logs <pod-name> -n production --previous

# Check resource limits
kubectl describe pod <pod-name> -n production

# Verify environment variables
kubectl get configmap tictactoe-config -o yaml
```

#### 3. Service Not Responding

**Symptoms**: Service endpoints returning errors

**Solution**:
```bash
# Check service endpoints
kubectl get endpoints backend-service -n production

# Verify pod readiness
kubectl get pods -n production -l app=backend

# Check pod logs
kubectl logs -l app=backend -n production --tail=100
```

#### 4. Deployment Stuck

**Symptoms**: Deployment not progressing

**Solution**:
```bash
# Check rollout status
kubectl rollout status deployment/backend-deployment -n production

# View rollout history
kubectl rollout history deployment/backend-deployment -n production

# Check events
kubectl get events -n production --sort-by='.lastTimestamp'
```

### Debug Commands

```bash
# Get detailed pod information
kubectl describe pod <pod-name> -n production

# Execute command in pod
kubectl exec -it <pod-name> -n production -- /bin/sh

# View pod logs (live)
kubectl logs -f <pod-name> -n production

# View logs from all pods in deployment
kubectl logs -f deployment/backend-deployment -n production

# Check resource usage
kubectl top pods -n production
kubectl top nodes

# View HPA metrics
kubectl get hpa -n production -w

# Check network connectivity
kubectl run -it --rm debug --image=busybox --restart=Never -- sh
```

### Performance Issues

1. **High Response Time**
   - Check HPA scaling
   - Review resource limits
   - Analyze database queries
   - Check external service dependencies

2. **Memory Leaks**
   - Monitor memory trends
   - Analyze heap dumps
   - Review application code
   - Adjust memory limits

3. **CPU Throttling**
   - Increase CPU limits
   - Optimize application code
   - Review CPU-intensive operations
   - Consider vertical scaling

## Best Practices

1. **Always test deployments in staging first**
2. **Monitor key metrics during deployment**
3. **Have rollback plan ready**
4. **Use gradual rollout for high-risk changes**
5. **Maintain deployment documentation**
6. **Keep deployment window during low-traffic periods**
7. **Communicate deployments to stakeholders**
8. **Perform post-deployment validation**
9. **Document lessons learned**
10. **Regularly review and update deployment procedures**

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Docker Documentation](https://docs.docker.com/)

## Support

For deployment issues or questions:
- Create an issue in the repository
- Contact DevOps team
- Review monitoring dashboards
- Check application logs

---

Last updated: 2025-11-26
