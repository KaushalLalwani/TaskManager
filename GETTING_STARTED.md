# Getting Started with PrimeTrade

Welcome! This guide will help you get PrimeTrade up and running on your local machine in minutes.

## 🎯 Quick Start (5 minutes)

### Option 1: Using Setup Script (Easiest)

```bash
# Clone the repository (if needed)
git clone <repo-url>
cd primetrade

# Run setup script
bash setup.sh

# The script will:
# ✅ Create Python virtual environment
# ✅ Install backend dependencies
# ✅ Install frontend dependencies
# ✅ Create .env files with defaults
```

### Option 2: Manual Setup

#### Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app/main.py
```

The backend will start at `http://localhost:8000`

#### Frontend Setup (in a new terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at `http://localhost:5173`

## 📱 First Steps

### 1. Access the Application

Open your browser and go to: **http://localhost:5173**

### 2. Register a New Account

- Click on "Register"
- Fill in your email, username, and password
- Click "Register"

### 3. Log In

- Use your credentials to log in
- You'll be redirected to the dashboard

### 4. Create Your First Task

- Click "Add New Task"
- Enter task details
- Click "Create Task"

### 5. Manage Tasks

- Click checkbox to mark tasks complete
- Click ✏️ to edit
- Click 🗑️ to delete

## 📚 API Documentation

Once the backend is running, access the API docs:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

### Example API Request

```bash
# Register a user
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "password"
  }'

# Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'

# Create a task (replace TOKEN with your JWT)
curl -X POST "http://localhost:8000/api/v1/tasks/" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Task",
    "description": "Task description",
    "completed": false
  }'
```

## 🧪 Using Postman

We've included a Postman collection for easy API testing!

### Import Collection

1. Open Postman
2. Click "Import"
3. Select `PrimeTrade_API.postman_collection.json`
4. Click "Import"

### Test the APIs

1. Go to the "Login" request
2. Send the request
3. Copy the `access_token` from response
4. Go to Collection Settings → Variables
5. Paste the token in the `token` variable
6. Now you can test other endpoints!

## 🔧 Configuration

### Backend Configuration (.env)

```properties
# Database
DATABASE_URL=sqlite:///./test.db
# For PostgreSQL: postgresql://user:password@localhost/primetrade

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=["*"]  # Change to ["https://yourdomain.com"] in production
```

### Frontend Configuration (.env)

```properties
# Backend API URL
VITE_API_URL=http://localhost:8000
```

## 📁 Project Structure

```
primetrade/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Configuration
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Data validation
│   │   ├── services/       # Business logic
│   │   └── main.py         # Entry point
│   ├── requirements.txt
│   └── .env
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── api/            # API integration
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # State management
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── .env
│
├── README.md               # Project README
├── GETTING_STARTED.md      # This file
├── SCALABILITY.md          # Scalability guide
├── DEPLOYMENT.md           # Deployment guide
└── setup.sh                # Automation script
```

## 🐛 Troubleshooting

### Backend Issues

#### "Port 8000 already in use"
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

#### "ModuleNotFoundError"
```bash
# Make sure you're in the virtual environment
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

#### Database errors
```bash
# Reset database
rm backend/test.db

# Restart backend
python app/main.py
```

### Frontend Issues

#### "npm: command not found"
- Install Node.js from https://nodejs.org/

#### "Cannot find module"
```bash
# Clear node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### API Issues

#### "CORS error"
- Ensure backend is running
- Check CORS_ORIGINS in backend .env

#### "401 Unauthorized"
- Token might be expired
- Try logging in again

#### "Cannot connect to API"
- Check VITE_API_URL in frontend .env
- Ensure backend is running (http://localhost:8000)

## 🚀 Next Steps

1. **Explore the code**
   - Check backend logic in `backend/app/services/`
   - Check frontend components in `frontend/src/components/`

2. **Read documentation**
   - Backend: [backend/README.md](./backend/README.md)
   - Frontend: [frontend/README.md](./frontend/README.md)
   - Scalability: [SCALABILITY.md](./SCALABILITY.md)

3. **Make changes**
   - Backend hot reloads with `--reload` flag
   - Frontend hot reloads automatically with Vite

4. **Test your changes**
   - Use Postman collection for API testing
   - Test UI in browser at http://localhost:5173

## 📋 Development Checklist

- [ ] Both servers running (backend at 8000, frontend at 5173)
- [ ] Can register a new account
- [ ] Can log in with credentials
- [ ] Can create a task
- [ ] Can read/update/delete tasks
- [ ] API docs accessible at http://localhost:8000/api/docs
- [ ] No console errors in browser DevTools
- [ ] No errors in terminal for both servers

## 💡 Tips

- **Use browser DevTools** (F12) to debug frontend issues
- **Check terminal output** for backend error messages
- **Read API documentation** at http://localhost:8000/api/docs
- **Use Postman** to test API endpoints before troubleshooting frontend
- **Clear localStorage** if you have auth issues: `localStorage.clear()` in DevTools console

## 📞 Getting Help

1. Check existing error messages
2. Review [SCALABILITY.md](./SCALABILITY.md) and [DEPLOYMENT.md](./DEPLOYMENT.md)
3. Check API documentation at http://localhost:8000/api/docs
4. Review code comments and docstrings
5. Create an issue with detailed error logs

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy Tutorial](https://docs.sqlalchemy.org/)
- [JWT Authentication](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

**Congratulations!** 🎉 You're now ready to develop with PrimeTrade!

For deployment and advanced configuration, see [DEPLOYMENT.md](./DEPLOYMENT.md)
