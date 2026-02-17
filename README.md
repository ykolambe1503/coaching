# Coaching Platform - AI-Driven System for MPSC/UPSC

AI-driven coaching platform for MPSC/UPSC exam preparation with role-based access control, batch management, and human-in-the-loop architecture.

## 🏗️ Architecture

- **Backend**: Spring Boot 3.2.x (Java 17)
- **Database**: PostgreSQL 15
- **Security**: JWT-based authentication
- **AI Engine**: Python FastAPI with Multimodal LLMs (planned for Phase 2)

## 📋 Features

### User Management
- Role-based access control (ADMIN, FACULTY, STUDENT)
- JWT authentication
- User registration and login
- Password encryption with BCrypt

### Batch Management
- Create and manage batches (ADMIN only)
- Assign students and faculty to batches
- Role-based batch visibility
- Track batch timelines

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
cd /Users/apple/Work/Coaching/coaching
```

2. **Start PostgreSQL database**
```bash
docker-compose up -d
```

3. **Build the project**
```bash
mvn clean install
```

4. **Run the application**
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@coaching.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "username": "admin",
  "email": "admin@coaching.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN"
}
```

### Batch Management Endpoints

> **Note:** All batch endpoints require authentication. Include the JWT token in the Authorization header:
> ```
> Authorization: Bearer <your-jwt-token>
> ```

#### Create Batch (ADMIN only)
```bash
POST /api/batches
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "UPSC 2026 Batch",
  "description": "Morning batch for UPSC preparation",
  "startDate": "2026-03-01",
  "endDate": "2027-02-28"
}
```

#### Get All Batches
```bash
GET /api/batches
Authorization: Bearer <token>
```

#### Get Batch by ID
```bash
GET /api/batches/{batchId}
Authorization: Bearer <token>
```

#### Update Batch (ADMIN only)
```bash
PUT /api/batches/{batchId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Batch Name",
  "description": "Updated description",
  "startDate": "2026-03-01",
  "endDate": "2027-02-28"
}
```

#### Delete Batch (ADMIN only)
```bash
DELETE /api/batches/{batchId}
Authorization: Bearer <token>
```

#### Assign Students (ADMIN only)
```bash
POST /api/batches/{batchId}/assign-students
Authorization: Bearer <token>
Content-Type: application/json

["student-uuid-1", "student-uuid-2"]
```

#### Assign Faculty (ADMIN only)
```bash
POST /api/batches/{batchId}/assign-faculty
Authorization: Bearer <token>
Content-Type: application/json

["faculty-uuid-1", "faculty-uuid-2"]
```

## 🔐 User Roles

### ADMIN
- Create, update, and delete batches
- Assign students and faculty to batches
- View all batches
- Full system access

### FACULTY
- View assigned batches
- View students in their batches
- (Future: Grade assignments, provide feedback)

### STUDENT
- View enrolled batches
- (Future: Submit assignments, view grades)

## 🗄️ Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Encrypted)
- `first_name`
- `last_name`
- `role` (ADMIN/FACULTY/STUDENT)
- `enabled` (Boolean)
- `created_at`, `updated_at`

### Batches Table
- `id` (UUID, Primary Key)
- `name`
- `description`
- `start_date`, `end_date`
- `created_by_id` (Foreign Key to Users)
- `created_at`, `updated_at`

### Many-to-Many Tables
- `batch_students` (batch_id, student_id)
- `batch_faculty` (batch_id, faculty_id)

## 🧪 Testing

### Run Tests
```bash
mvn test
```

### Run Integration Tests
```bash
mvn verify
```

## 🛠️ Technology Stack

- **Java 17** - Programming language
- **Spring Boot 3.2.x** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data access layer
- **PostgreSQL 15** - Relational database
- **JWT (io.jsonwebtoken)** - Token-based authentication
- **Lombok** - Reduce boilerplate code
- **Maven** - Build tool
- **Docker** - Containerization

## 🔄 Roadmap

### Phase 1: User Management ✅ (Current)
- User authentication and authorization
- Role-based access control
- Batch management

### Phase 2: AI Engine Integration (Planned)
- Python FastAPI service
- OCR for answer sheet processing
- AI-powered grading with Gemini 1.5 Pro
- Multilingual support (Marathi/Hindi)

### Phase 3: Assignment Management (Planned)
- Upload answer sheets
- AI grading with faculty review
- Human-in-the-loop workflow
- Feedback system

### Phase 4: Analytics & Reporting (Planned)
- Student performance tracking
- Batch analytics
- Progress reports

## 📝 Configuration

### Application Properties
Configuration is in `src/main/resources/application.yml`:

- **Database**: PostgreSQL connection settings
- **JWT**: Secret key and token expiration
- **Logging**: Debug levels for development

### Environment Variables (Production)
For production deployment, use environment variables:
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://prod-db:5432/coaching_db
SPRING_DATASOURCE_USERNAME=prod_user
SPRING_DATASOURCE_PASSWORD=prod_pass
JWT_SECRET=<secure-secret-key>
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## 📄 License

This project is proprietary software for coaching platform use.

## 👥 Contact

For questions or support, contact your development team.
