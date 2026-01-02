output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = "To be configured with EKS module"
}
