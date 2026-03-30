# Backend API

FastAPI backend for the PrimeTrade assignment. The API provides JWT authentication, role-based access control, and CRUD operations for tasks.

## Features
- JWT login and protected routes
- Password hashing with `pbkdf2_sha256`
- User and admin authorization flow
- Versioned REST API under `/api/v1`
- Pydantic validation for auth and task payloads
- Swagger and ReDoc documentation
- SQLAlchemy models compatible with SQLite and PostgreSQL
- Request logging middleware
- Pytest coverage for auth, task CRUD, admin access, and validation

## Environment
Create `backend/.env` from `backend/.env.example`:

```env
DATABASE_URL=postgresql://primetrade:primetrade123@localhost:5432/primetrade
SECRET_KEY=replace-with-a-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

For quick local development you can also use SQLite:

```env
DATABASE_URL=sqlite:///./test.db
```

## Run Locally
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

## Documentation
- Swagger: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

## Test Suite
```bash
cd backend
pytest -q
```

## Auth Flow
1. Register with `POST /api/v1/auth/register`
2. Log in with `POST /api/v1/auth/login`
3. Send `Authorization: Bearer <token>` on protected routes
4. Admin-only routes enforce `is_admin=True`

## Task Entity
Schema fields:
- `id`
- `title`
- `description`
- `completed`
- `owner_id`
- `created_at`
- `updated_at`

## Notes for Reviewers
- Default local storage is SQLite for convenience.
- Production-ready configuration supports PostgreSQL through `DATABASE_URL`.
- Docker support is included through `backend/Dockerfile` and root `docker-compose.yml`.
