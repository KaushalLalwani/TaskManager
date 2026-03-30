# Frontend App

React frontend for the PrimeTrade assignment. It provides a lightweight UI for registration, login, and task management against the FastAPI backend.

## Features
- Register and log in users
- Store and send JWTs on protected requests
- Protected dashboard view
- Create, edit, toggle, and delete tasks
- Render API validation and error messages
- Show success feedback for CRUD actions

## Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

`.env` example:
```env
VITE_API_URL=http://localhost:8000
```

## Scripts
- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run preview`

## Main Screens
- `/login`
- `/register`
- `/dashboard`

## Integration Notes
- Auth token is stored in `localStorage`
- All task endpoints require a valid Bearer token
- `401` responses clear stale auth and redirect back to login

## Reviewer Walkthrough
1. Register a user
2. Log in
3. Create a task from the dashboard
4. Edit, complete, and delete tasks
5. Inspect API docs in the backend Swagger UI
