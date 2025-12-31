# Kubernetes Tooling Container

This Docker setup provides a lightweight `kubectl` runner for the manifests in `kubernetes/`.

## Usage

```bash
KUBECONFIG_PATH=$HOME/.kube/config docker compose -f docker/docker-compose.yml run --rm kube-tools apply
```

Commands:
- `apply` applies manifests
- `delete` removes manifests
- `diff` shows a diff
