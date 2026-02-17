# Local Development Setup Guide

## Prerequisites

### 1. Install Docker Desktop

Download and install Docker Desktop for Mac:
```bash
# Using Homebrew (recommended)
brew install --cask docker

# Or download from: https://www.docker.com/products/docker-desktop
```

After installation, start Docker Desktop from Applications.

## Starting the Application

### Step 1: Start PostgreSQL Database

```bash
# Navigate to project directory
cd /Users/apple/Work/Coaching/CoachingPlatform

# Start the database
docker compose up -d

# Verify it's running
docker ps
```

Expected output:
```
CONTAINER ID   IMAGE                 STATUS         PORTS                    NAMES
xxxxx          postgres:15-alpine    Up 2 seconds   0.0.0.0:5432->5432/tcp   coaching-postgres
```

### Step 2: Run the Application

```bash
# Run with Maven
mvn spring-boot:run

# Or build and run the JAR
mvn clean package -DskipTests
java -jar target/platform-0.0.1-SNAPSHOT.jar
```

The application will start on http://localhost:8080

### Step 3: Test the APIs

#### Register a new user:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Save the JWT token from the response.

#### Create a Batch (use the token):
```bash
curl -X POST http://localhost:8080/api/batches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "Spring 2024 Batch",
    "description": "Full Stack Development Batch",
    "startDate": "2024-03-01",
    "endDate": "2024-08-31"
  }'
```

#### Get all batches:
```bash
curl -X GET http://localhost:8080/api/batches \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Managing Docker

### Stop the database:
```bash
docker compose down
```

### View logs:
```bash
docker compose logs -f postgres
```

### Reset database (WARNING: Deletes all data):
```bash
docker compose down -v
docker compose up -d
```

## Troubleshooting

### Port 5432 already in use:
```bash
# Find what's using the port
lsof -i :5432

# If it's PostgreSQL, stop it
brew services stop postgresql
```

### Port 8080 already in use:
```bash
# Find the process
lsof -i :8080

# Kill it if needed
kill -9 <PID>

# Or change port with environment variable
export SERVER_PORT=8081
mvn spring-boot:run
```

### Database connection issues:
```bash
# Verify PostgreSQL is running
docker ps

# Check logs
docker logs coaching-postgres

# Test connection
docker exec -it coaching-postgres psql -U coaching_user -d coaching_db
```

## Development Tips

### Hot Reload
Use Spring Boot DevTools for automatic restart:
```bash
mvn spring-boot:run
```

### Database GUI
Connect to PostgreSQL using:
- **pgAdmin**: Host: localhost, Port: 5432, User: coaching_user, Password: coaching_pass
- **DBeaver**: Same credentials
- **TablePlus**: Same credentials

### API Testing
Use one of:
- **Postman**: Import API endpoints
- **Thunder Client** (VS Code extension)
- **curl**: As shown in examples above
- **HTTPie**: `http POST localhost:8080/api/auth/register ...`

## Cloud Deployment

When deploying to cloud, see [CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md) for:
- Environment variable configuration
- Cloud platform examples (AWS, GCP, Azure, Heroku)
- Production best practices
