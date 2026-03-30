# Quick Reference Card

## 🚀 Start Application

```bash
# Setup (one-time)
bash setup.sh

# Backend (Terminal 1)
cd backend && source venv/bin/activate && python app/main.py

# Frontend (Terminal 2)
cd frontend && npm run dev
```

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/api/docs |
| API Docs (ReDoc) | http://localhost:8000/api/redoc |
| API Health | http://localhost:8000/health |

## 📝 Default Test Credentials

After registration, use any credentials you created.

Example:
- Email: `test@example.com`
- Password: `Test123!`

## 🔗 Important Endpoints

### Authentication
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/v1/auth/register` | No |
| POST | `/api/v1/auth/login` | No |
| GET | `/api/v1/auth/me` | ✅ |

### Tasks
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/v1/tasks/` | ✅ |
| GET | `/api/v1/tasks/` | ✅ |
| GET | `/api/v1/tasks/{id}` | ✅ |
| PUT | `/api/v1/tasks/{id}` | ✅ |
| DELETE | `/api/v1/tasks/{id}` | ✅ |
| GET | `/api/v1/tasks/all` | ✅ Admin |

### Users (Admin)
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/v1/users/` | ✅ Admin |
| GET | `/api/v1/users/{id}` | ✅ Admin |

## 🔑 Environment Variables

### Backend (.env)
```properties
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env)
```properties
VITE_API_URL=http://localhost:8000
```

## 📦 Dependencies

### Backend
```bash
# Install
pip install -r backend/requirements.txt

# Key packages
fastapi          # Web framework
uvicorn          # Server
sqlalchemy       # ORM
pydantic         # Validation
python-jose      # JWT
passlib           # Password hashing
bcrypt           # Encryption
```

### Frontend
```bash
# Install
npm install

# Key packages
react            # UI framework
react-router-dom # Routing
axios            # HTTP client
vite             # Build tool
```

## 🧪 API Testing with cURL

### Register
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"user","password":"pass"}'
```

### Login
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}'
```

### Create Task (replace TOKEN)
```bash
curl -X POST "http://localhost:8000/api/v1/tasks/" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Task","description":"Desc","completed":false}'
```

### Get Tasks (replace TOKEN)
```bash
curl -X GET "http://localhost:8000/api/v1/tasks/" \
  -H "Authorization: Bearer TOKEN"
```

## 🔍 Debugging Tips

### Backend Debugging
```bash
# Check if port 8000 is in use
lsof -i :8000

# Check logs
python app/main.py  # See console output

# Test specific endpoint
curl http://localhost:8000/health
```

### Frontend Debugging
```bash
# Open browser DevTools: F12
# Console: Check for errors
# Network: Check API requests
# Local Storage: Check token storage

# Check if port 5173 is in use
lsof -i :5173
```

### Database Debugging
```bash
# Check if database exists
ls -la backend/*.db

# Reset database
rm backend/test.db

# Restart backend to recreate
```

## 📚 Important Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `GETTING_STARTED.md` | Quick start guide |
| `SCALABILITY.md` | Production scaling |
| `DEPLOYMENT.md` | Deployment guide |
| `PROJECT_COMPLETION.md` | Completion summary |
| `docker-compose.yml` | Docker setup |
| `PrimeTrade_API.postman_collection.json` | Postman collection |

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process: `kill -9 PID` |
| Module not found | `pip install -r requirements.txt` |
| npm not found | Install Node.js from nodejs.org |
| CORS error | Check `CORS_ORIGINS` in backend .env |
| Cannot login | Check credentials, verify backend is running |
| Token expired | Log out and log in again |
| Database error | Delete `.db` file and restart backend |

## 🚀 Deployment Commands

### Docker
```bash
# Build
docker build -t primetrade-backend ./backend
docker build -t primetrade-frontend ./frontend

# Run with compose
docker-compose up -d
```

### Production
```bash
# Install production dependencies
pip install gunicorn

# Run with gunicorn
gunicorn app.main:app --workers 4 --bind 0.0.0.0:8000
```

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Backend Files | 20+ |
| Frontend Files | 15+ |
| Total Lines of Code | 4,000+ |
| API Endpoints | 10+ |
| Database Tables | 2 |
| React Components | 6 |
| Documentation Pages | 5 |
| Estimated Complexity | Medium |

## ✅ Pre-Deployment Checklist

- [ ] Backend starts without errors
- [ ] Frontend builds successfully
- [ ] Can register new user
- [ ] Can login
- [ ] Can create task
- [ ] Can read/update/delete task
- [ ] API docs accessible
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database initialized

## 🎯 Next Steps

1. **Development**
   - Start both servers
   - Test all features
   - Check logs for errors

2. **Testing**
   - Use Postman collection
   - Test with different users
   - Verify all CRUD operations

3. **Deployment**
   - See DEPLOYMENT.md
   - Configure production database
   - Set security keys
   - Deploy to server

4. **Monitoring**
   - Set up logging
   - Configure alerts
   - Monitor performance

## 💡 Pro Tips

- Use Postman for API testing
- Check browser DevTools for frontend issues
- Read API docs at `/api/docs`
- Check server logs for backend errors
- Clear browser cache if UI doesn't update
- Use `.env.example` as template

## 📞 Support References

- **API Docs**: http://localhost:8000/api/docs
- **Getting Started**: `GETTING_STARTED.md`
- **Troubleshooting**: See `GETTING_STARTED.md` section
- **Scalability**: `SCALABILITY.md`
- **Deployment**: `DEPLOYMENT.md`

---

**Version**: 1.0.0
**Last Updated**: 2024
**Status**: Production Ready ✅
