# PrimeTrade Assignment Submission

PrimeTrade is a full-stack task management system built for the Backend Developer Intern assignment. It delivers a secure REST API with JWT authentication, role-based access control, API versioning, Swagger docs, and a basic React frontend that exercises the API end to end.

## Assignment Checklist

### Backend
- User registration and login with password hashing and JWT authentication
- Role-based access control for `user` and `admin`
- CRUD APIs for a secondary entity: `tasks`
- API versioning under `/api/v1`
- Request validation with Pydantic
- Swagger and ReDoc documentation
- Database schema with SQLAlchemy and PostgreSQL-ready configuration
- Structured project layout for future modules

### Frontend
- Register and log in users
- Access a protected dashboard with JWT-based API calls
- Create, list, update, and delete tasks
- Display validation, success, and error feedback from the API

### Security and Scalability
- JWT Bearer authentication
- Password hashing with `pbkdf2_sha256`
- Validation on auth and task payloads
- Configurable CORS origins
- PostgreSQL + Redis ready Docker Compose setup
- Scalability notes in [SCALABILITY.md](/home/kaushal/primetrade{backend]/SCALABILITY.md)

## Tech Stack
- Backend: FastAPI, SQLAlchemy, Pydantic, python-jose
- Frontend: React, Vite
- Database: SQLite for local quick start, PostgreSQL-ready via env/docker
- Infra: Docker Compose, Redis placeholder for caching/session extensions

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Backend URLs:
- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend URL:
- App: `http://localhost:5173`

## API Summary

### Authentication
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Tasks
- `POST /api/v1/tasks/`
- `GET /api/v1/tasks/`
- `GET /api/v1/tasks/{task_id}`
- `PUT /api/v1/tasks/{task_id}`
- `DELETE /api/v1/tasks/{task_id}`
- `GET /api/v1/tasks/all` admin only

### Users
- `GET /api/v1/users/` admin only
- `GET /api/v1/users/{user_id}` admin only

## Tests and Verification

### Backend
```bash
cd backend
pytest -q
```

### Frontend
```bash
cd frontend
npm run lint
npm run build
```

## Deliverables Included
- Backend codebase with modular structure
- Basic frontend UI connected to backend APIs
- Swagger/OpenAPI docs and Postman collection
- Setup documentation in [backend/README.md](/home/kaushal/primetrade{backend]/backend/README.md) and [frontend/README.md](/home/kaushal/primetrade{backend]/frontend/README.md)
- Scalability note in [SCALABILITY.md](/home/kaushal/primetrade{backend]/SCALABILITY.md)
- Deployment notes in [DEPLOYMENT.md](/home/kaushal/primetrade{backend]/DEPLOYMENT.md)
