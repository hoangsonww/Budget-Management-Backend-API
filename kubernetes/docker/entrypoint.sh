#!/bin/sh
set -e

ACTION=${1:-plan}

case "$ACTION" in
  apply)
    kubectl apply -f /manifests
    ;;
  delete)
    kubectl delete -f /manifests
    ;;
  diff)
    kubectl diff -f /manifests || true
    ;;
  plan)
    kubectl version --client=true
    echo "Manifests mounted at /manifests"
    echo "Use: apply | delete | diff"
    ;;
  *)
    exec "$@"
    ;;
esac
