# Mini Project Management API

A REST API for managing Projects, Tasks, and Comments built with Node.js, TypeScript, Express, and PostgreSQL.

## Features

- User management
- Project creation with ownership
- Task management with status tracking
- Comments on tasks
- User assignment to tasks
- Filtering and pagination for tasks
- SQL relationships with proper JOINs

## Prerequisites

- Node.js 18+
- PostgreSQL 15+ (or Docker)
- npm or yarn

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL (using Docker)

```bash
docker-compose up -d
```

### 3. Configure environment

Copy `.env.example` to `.env` and update values if needed:

```bash
cp .env.example .env
```

### 4. Run migrations

```bash
npm run migrate
```

### 5. Start the server

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

## API Endpoints

### Health Check

```
GET /health
```

### Users

#### Create User
```
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### List Users
```
GET /users
```

#### Get User by ID
```
GET /users/:id
```

### Projects

#### Create Project
```
POST /projects
Content-Type: application/json

{
  "name": "Project Apollo",
  "description": "Internal product build",
  "owner_id": "UUID"
}
```

#### List Projects
```
GET /projects
```

#### Get Project by ID
```
GET /projects/:id
```

### Tasks

#### Create Task
```
POST /tasks
Content-Type: application/json

{
  "project_id": "UUID",
  "title": "Setup CI/CD",
  "description": "Configure pipeline",
  "assigned_to": "UUID" (optional)
}
```

#### List Tasks with Filters
```
GET /tasks?project_id=UUID&status=todo&assigned_to=UUID&page=1&limit=10
```

Query Parameters:
- `project_id` - Filter by project
- `status` - Filter by status (todo, in_progress, done)
- `assigned_to` - Filter by assigned user
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

Response includes:
- Task details
- Project info
- Assigned user info
- Latest comment

#### Get Task by ID
```
GET /tasks/:id
```

### Comments

#### Add Comment to Task
```
POST /tasks/:id/comments
Content-Type: application/json

{
  "user_id": "UUID",
  "message": "CI/CD pipeline deployed successfully."
}
```

#### Get Comments for Task
```
GET /tasks/:id/comments
```

## Data Model

### Users
| Field      | Type           |
|------------|----------------|
| id         | UUID (PK)      |
| name       | VARCHAR(255)   |
| email      | VARCHAR(255)   |
| created_at | TIMESTAMP      |

### Projects
| Field       | Type           |
|-------------|----------------|
| id          | UUID (PK)      |
| name        | VARCHAR(255)   |
| description | TEXT           |
| owner_id    | UUID (FK)      |
| created_at  | TIMESTAMP      |

### Tasks
| Field       | Type                            |
|-------------|---------------------------------|
| id          | UUID (PK)                       |
| project_id  | UUID (FK)                       |
| title       | VARCHAR(255)                    |
| description | TEXT                            |
| status      | ENUM(todo, in_progress, done)   |
| assigned_to | UUID (FK, nullable)             |
| created_at  | TIMESTAMP                       |

### Comments
| Field      | Type           |
|------------|----------------|
| id         | UUID (PK)      |
| task_id    | UUID (FK)      |
| user_id    | UUID (FK)      |
| message    | TEXT           |
| created_at | TIMESTAMP      |

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations

## Bonus Features

### Docker Setup ✅
Complete Docker Compose configuration for PostgreSQL database:

```bash
docker-compose up -d
```

This starts a PostgreSQL 15 container with:
- Pre-configured database (`project_management`)
- Persistent volume for data
- Health checks
- Port 5432 exposed
