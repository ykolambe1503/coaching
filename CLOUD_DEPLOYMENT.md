# Cloud Deployment Configuration Guide

## Environment Variables for Different Environments

### Local Development
Uses defaults from `application.yml`. No environment variables needed.

### Staging/Production
Set these environment variables in your cloud platform:

```bash
# Database (Cloud Database URL)
DATABASE_URL=jdbc:postgresql://your-cloud-db-host:5432/coaching_db
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_secure_password

# JPA (Use 'validate' in production!)
JPA_DDL_AUTO=validate
JPA_SHOW_SQL=false
JPA_FORMAT_SQL=false

# Server
SERVER_PORT=8080

# JWT (MUST change in production!)
JWT_SECRET=generate-a-new-secure-secret-key-here
JWT_EXPIRATION=86400000

# Security
SECURITY_USER=your_admin_user
SECURITY_PASSWORD=your_secure_admin_password

# Logging (INFO or WARN in production)
LOG_LEVEL=INFO
LOG_LEVEL_SECURITY=WARN
```

## Cloud Platform Examples

### AWS Elastic Beanstalk
Set environment variables in Configuration > Software > Environment properties

### Google Cloud Run
```bash
gcloud run services update coaching-platform \
  --set-env-vars DATABASE_URL=jdbc:postgresql://...,DATABASE_USERNAME=...,DATABASE_PASSWORD=...
```

### Heroku
```bash
heroku config:set DATABASE_URL=jdbc:postgresql://...
heroku config:set JWT_SECRET=your-secret-key
```

### Azure App Service
Set in Configuration > Application settings

### Docker/Kubernetes
Use ConfigMaps and Secrets:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coaching-platform-config
data:
  DATABASE_URL: "jdbc:postgresql://..."
  SERVER_PORT: "8080"
---
apiVersion: v1
kind: Secret
metadata:
  name: coaching-platform-secrets
type: Opaque
stringData:
  DATABASE_PASSWORD: "your-secure-password"
  JWT_SECRET: "your-jwt-secret"
```

## Important Production Notes

1. **Always use `JPA_DDL_AUTO=validate`** in production (never `update` or `create-drop`)
2. **Generate a new JWT_SECRET** for production
3. **Use managed databases** (AWS RDS, Google Cloud SQL, etc.)
4. **Set logging to INFO or WARN** to reduce log volume
5. **Use secrets management** for sensitive values (AWS Secrets Manager, Azure Key Vault, etc.)
