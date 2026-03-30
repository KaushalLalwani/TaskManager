# Deployment Guide

This guide covers deploying PrimeTrade to various production environments.

## 📋 Pre-Deployment Checklist

- [ ] Update `SECRET_KEY` in backend `.env`
- [ ] Set `DEBUG = False` in production config
- [ ] Configure proper `DATABASE_URL` for production database
- [ ] Set `CORS_ORIGINS` to allowed domains only
- [ ] Configure SSL/TLS certificates
- [ ] Set up monitoring and logging
- [ ] Create database backups
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Performance testing with production data

## 🐳 Docker Deployment (Recommended)

### 1. Create Dockerfile for Backend

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app ./app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# Run with gunicorn
CMD ["gunicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

### 2. Create Dockerfile for Frontend

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose for Production

```yaml
version: '3.8'

services:
  backend:
    image: primetrade-backend:latest
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/primetrade
      SECRET_KEY: ${SECRET_KEY}
      CORS_ORIGINS: '["https://primetrade.com"]'
    depends_on:
      db:
        condition: service_healthy
    networks:
      - primetrade-network
    restart: always
    deploy:
      replicas: 3

  frontend:
    image: primetrade-frontend:latest
    ports:
      - "80:80"
    environment:
      VITE_API_URL: https://api.primetrade.com
    depends_on:
      - backend
    networks:
      - primetrade-network
    restart: always

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: primetrade
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - primetrade-network
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - primetrade-network
    restart: always

volumes:
  postgres_data:

networks:
  primetrade-network:
```

### 4. Build and Push Images

```bash
# Build images
docker build -t primetrade-backend:latest ./backend
docker build -t primetrade-frontend:latest ./frontend

# Tag for registry
docker tag primetrade-backend:latest registry.example.com/primetrade-backend:latest
docker tag primetrade-frontend:latest registry.example.com/primetrade-frontend:latest

# Push to registry
docker push registry.example.com/primetrade-backend:latest
docker push registry.example.com/primetrade-frontend:latest

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## ☸️ Kubernetes Deployment

### 1. Backend Deployment

```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: primetrade-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: primetrade-backend
  template:
    metadata:
      labels:
        app: primetrade-backend
    spec:
      containers:
      - name: primetrade-backend
        image: registry.example.com/primetrade-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: primetrade-secrets
              key: database-url
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: primetrade-secrets
              key: secret-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 2. Service Configuration

```yaml
# k8s/backend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: primetrade-backend
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8000
  selector:
    app: primetrade-backend
```

### 3. Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace primetrade

# Create secrets
kubectl create secret generic primetrade-secrets \
  --from-literal=database-url="postgresql://..." \
  --from-literal=secret-key="..." \
  -n primetrade

# Apply deployments
kubectl apply -f k8s/ -n primetrade

# Check status
kubectl get pods -n primetrade
```

## 🌐 Cloud Deployment

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create primetrade-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev -a primetrade-backend

# Set environment variables
heroku config:set SECRET_KEY="your-secret-key" -a primetrade-backend
heroku config:set DEBUG="False" -a primetrade-backend

# Deploy
git push heroku main

# Check logs
heroku logs --tail -a primetrade-backend
```

### AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init -p python-3.11 primetrade-backend

# Create environment
eb create primetrade-prod

# Deploy
eb deploy

# View logs
eb logs
```

### Google Cloud Run

```bash
# Build image
gcloud builds submit --tag gcr.io/PROJECT_ID/primetrade-backend

# Deploy
gcloud run deploy primetrade-backend \
  --image gcr.io/PROJECT_ID/primetrade-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars=DATABASE_URL=postgresql://...

# View frontend logs
gcloud run logs read primetrade-backend --limit 50
```

## 🔧 Nginx Configuration

```nginx
# /etc/nginx/sites-available/primetrade
upstream backend {
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.primetrade.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name api.primetrade.com;

    ssl_certificate /etc/letsencrypt/live/api.primetrade.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.primetrade.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # API proxy
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Rate limiting
        limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
        limit_req zone=api burst=20;
    }
}
```

## 📊 Monitoring Setup

### Prometheus Monitoring

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'primetrade-backend'
    static_configs:
      - targets: ['localhost:8000']
```

### Grafana Dashboards

1. Create data source pointing to Prometheus
2. Import dashboard templates
3. Set up alerts for:
   - API response time > 200ms
   - Error rate > 1%
   - Database connection pool full
   - Disk space < 10%

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run backend tests
        run: |
          cd backend
          pip install -r requirements.txt
          pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t backend:${{ github.sha }} ./backend
      
      - name: Push to registry
        run: |
          echo ${{ secrets.REGISTRY_PASSWORD }} | docker login -u ${{ secrets.REGISTRY_USER }} --password-stdin
          docker tag backend:${{ github.sha }} registry.example.com/backend:latest
          docker push registry.example.com/backend:latest
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/primetrade-backend \
            primetrade-backend=registry.example.com/backend:latest
```

## 🚨 Rollback Procedure

```bash
# View deployment history
kubectl rollout history deployment/primetrade-backend

# Rollback to previous version
kubectl rollout undo deployment/primetrade-backend

# Rollback to specific revision
kubectl rollout undo deployment/primetrade-backend --to-revision=2

# Check rollout status
kubectl rollout status deployment/primetrade-backend
```

## 💾 Backup & Recovery

### Database Backup

```bash
# PostgreSQL backup
pg_dump -h localhost -U primetrade primetrade > backup.sql

# Scheduled backup with cron
0 2 * * * pg_dump -h localhost -U primetrade primetrade | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz
```

### Restore from Backup

```bash
# Restore database
psql -h localhost -U primetrade primetrade < backup.sql

# Restore gzipped backup
gunzip -c backup.sql.gz | psql -h localhost -U primetrade primetrade
```

## 📈 Performance Tuning

### PostgreSQL Tuning

```ini
# postgresql.conf
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 16MB
```

### Backend Application Tuning

```python
# Increase worker count
gunicorn app.main:app --workers 8 --worker-class uvicorn.workers.UvicornWorker

# Enable caching
from fastapi_caching2 import FastAPICache2
FastAPICache2.init(RedisBackend(redis=redis_client))
```

## ✅ Post-Deployment Checks

- [ ] Health checks passing
- [ ] API endpoints responding
- [ ] Database connectivity confirmed
- [ ] Authentication working
- [ ] HTTPS/TLS configured
- [ ] CORS headers correct
- [ ] Logs being generated
- [ ] Monitoring alerts set up
- [ ] Load testing results acceptable
- [ ] Backup verification completed

---

**Deployment Date**: [To be filled]
**Deployed By**: [To be filled]
**Environment**: Production
**Status**: ✅ Live
