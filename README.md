# Task Manager

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aditya2112sharma/task-manager-backend.git
cd task-manager-backend
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URL=mongodb://127.0.0.1:27017/primeTrade?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.6.0
JWT_SECRET=your_jwt_secret_key
```

Start the development server:

```bash
npm run dev
```

The backend runs on **http://localhost:8000**.  
Swagger docs are available at **http://localhost:8000/api-docs**.


## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URL` | MongoDB connection string | `mongodb://127.0.0.1:27017/primeTrade` |
| `JWT_SECRET` | Secret key for signing JWTs | `mysecretkey` |

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login and receive cookie token | No |
| `POST` | `/auth/logout` | Logout and clear cookie | No |
| `GET` | `/me` | Get current logged-in user | Yes |

### Tasks

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/task/` | Get all tasks for logged-in user | Yes |
| `POST` | `/task/` | Create a new task | Yes |
| `GET` | `/task/all` | Get all tasks — admin only | Yes (admin) |
| `GET` | `/task/:id` | Get a single task by ID | Yes |
| `PUT` | `/task/:id` | Update a task by ID | Yes |
| `DELETE` | `/task/:id` | Delete a task by ID | Yes |
| `PATCH` | `/task/completed/:id` | Toggle task completion status | Yes |

#### Example — Register

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"
}
```

#### Example — Create Task

```http
POST /task/
Content-Type: application/json
Cookie: token=<jwt>

{
  "title": "Fix login bug",
  "description": "Resolve the 401 on expired sessions"
}
```

Full interactive documentation is available via Swagger UI at `http://localhost:8000/api-docs` when the backend is running.

---

## Database Models

### User (`Auth`)

| Field | Type | Required | Default |
|---|---|---|---|
| `name` | String | Yes | — |
| `email` | String | Yes | — |
| `password` | String | Yes | — (bcrypt hashed) |
| `role` | String (enum) | No | `"user"` |

Roles: `user`, `admin`

### Task

| Field | Type | Required | Default |
|---|---|---|---|
| `title` | String | Yes | — |
| `description` | String | Yes | — |
| `completed` | Boolean | No | `false` |
| `owner` | ObjectId (ref: Auth) | No | — |

---

| Command | Description |
|---|---|
| `npm run dev` | Start server with nodemon (auto-reload) |

- Passwords are hashed with bcrypt before being stored — plain-text passwords are never saved.
- The `task-api-collection.json` file in the backend can be imported into Postman or Insomnia for quick API testing.

---
### Scalability 
The backend can be split into separate microservices — auth and tasks run as independent deployable units, each with its own MongoDB collection, allowing them to scale independently under load. Upstash Redis already handles caching for task reads, cutting redundant database hits as user count grows. A load balancer (Nginx or AWS ALB) can sit in front of multiple backend container replicas — Docker Compose replicas or Kubernetes handles this without code changes. The MongoDB connection should move to Atlas with replica sets for read scaling and automatic failover.
