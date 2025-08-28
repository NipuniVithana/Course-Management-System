# Course Management System - Deployment Guide

This folder contains all the necessary files for deploying the Course Management System using Docker.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB RAM available
- Ports 80, 3000, 8080, 3306 available

### Development Deployment
```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start all services
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
# phpMyAdmin: http://localhost:8081
```

### Production Deployment
```bash
# 1. Configure production environment
cp .env.example .env.prod
# Edit .env.prod with production values

# 2. Deploy with production configuration
docker-compose -f production.yml --env-file .env.prod up -d
```

## 📁 Files Overview

### Docker Configuration
- `docker-compose.yml` - Main development deployment
- `production.yml` - Production deployment configuration
- `Dockerfile.backend` - Spring Boot backend container
- `Dockerfile.frontend` - React frontend container

### Nginx Configuration
- `nginx.conf` - Main reverse proxy configuration
- `nginx-frontend.conf` - Frontend-only nginx configuration

### Environment Configuration
- `.env.example` - Environment variables template
- Copy to `.env` and customize for your environment

## 🏗️ Architecture

```
Internet → Nginx (Port 80/443) → Frontend (React) + Backend API (Spring Boot) → MySQL Database
                                                    ↓
                                               phpMyAdmin (Optional)
```

### Service Ports
- **Nginx**: 80 (HTTP), 443 (HTTPS)
- **Frontend**: 3000 (development), 80 (production)
- **Backend**: 8080
- **MySQL**: 3306
- **phpMyAdmin**: 8081

## 🔐 Security Features

### Nginx Security
- Rate limiting for API endpoints
- Security headers (XSS, CSRF protection)
- CORS configuration
- SSL/TLS support

### Application Security
- JWT token authentication
- Role-based access control
- Password hashing (BCrypt)
- SQL injection prevention

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- Backend: `http://localhost:8080/api/auth/health`
- Frontend: `http://localhost:3000/health`
- Nginx: `http://localhost/health`

### Logging
- Nginx logs: `./logs/nginx/`
- Backend logs: Docker logs
- Database logs: Docker logs

## 🔧 Troubleshooting

### Common Issues

#### Services not starting
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs [service-name]
```

#### Database connection issues
```bash
# Check MySQL is ready
docker-compose logs mysql

# Test database connection
docker-compose exec backend curl mysql:3306
```

#### Port conflicts
```bash
# Check what's using the ports
netstat -tulpn | grep :80
netstat -tulpn | grep :3306

# Modify ports in .env file
```

## 🚀 Deployment Commands

### Development
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### Production
```bash
# Deploy to production
docker-compose -f production.yml up -d

# Update application
docker-compose -f production.yml pull
docker-compose -f production.yml up -d --build

# Backup database
docker-compose exec mysql mysqldump -u root -p course_management_system > backup.sql
```

### Individual Services
```bash
# Restart specific service
docker-compose restart backend

# Scale service (if needed)
docker-compose up -d --scale backend=2

# Execute commands in container
docker-compose exec backend bash
```

## 📝 Environment Variables

### Required Variables
- `MYSQL_ROOT_PASSWORD` - MySQL root password
- `MYSQL_PASSWORD` - Application database password
- `JWT_SECRET` - JWT signing secret

### Optional Variables
- `FRONTEND_PORT` - Frontend port (default: 3000)
- `BACKEND_PORT` - Backend port (default: 8080)
- `NGINX_PORT` - Nginx HTTP port (default: 80)

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: |
          docker-compose -f deployment/production.yml pull
          docker-compose -f deployment/production.yml up -d
```

## 📱 Demo Accounts

After deployment, use these accounts to test:

- **Admin**: admin@university.edu / admin123
- **Lecturer**: lecturer@university.edu / lecturer123
- **Student**: student@university.edu / student123

## ⚡ Performance Tips

### Production Optimizations
1. Use nginx caching for static assets
2. Enable gzip compression
3. Configure database connection pooling
4. Set up SSL certificates
5. Use CDN for static assets

### Scaling
- Add load balancer for multiple backend instances
- Use read replicas for database
- Implement Redis for session storage
- Use container orchestration (Kubernetes)

## 🆘 Support

For deployment issues:
1. Check Docker logs: `docker-compose logs`
2. Verify environment variables in `.env`
3. Ensure all required ports are available
4. Check database connectivity
5. Review nginx configuration
