# Infrastructure (infra)

This directory holds IaC and deployment manifests (Terraform, CloudFormation, Kubernetes manifests, Helm charts, etc.).

## Contents
- `/infra/terraform` — terraform modules and environment configs
- `/infra/k8s` — kubernetes manifests and helm charts
- `/infra/ansible` — optional provisioning playbooks

## Getting started
1. Install required tools: terraform, kubectl, helm, awscli (or cloud SDK)
2. Example terraform commands (adjust to your structure)
   - `cd infra/terraform`
   - `terraform init`
   - `terraform plan -var-file=envs/dev.tfvars`
   - `terraform apply -var-file=envs/dev.tfvars`
3. Kubernetes / helm
   - `kubectl apply -f infra/k8s/`
   - `helm upgrade --install bychefiza infra/helm/bychefiza -f values.yaml`

## Secrets &amp; State
- Use remote state (e.g., S3 + DynamoDB for Terraform)
- Do not commit secrets — use a secrets manager (Vault, AWS Secrets Manager, Azure KeyVault)

## CI/CD
- CI pipelines should run `terraform fmt` / `plan` in PRs and `apply` via protected workflows/automation.

## Notes
- Replace sample commands with your cloud provider specifics and the repo's actual infra layout.
