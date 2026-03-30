#!/bin/bash

# PrimeTrade Setup Script
# This script sets up the entire project for development

set -e

echo "🚀 PrimeTrade - Setup Script"
echo "================================"

# Backend Setup
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "✅ Backend setup completed!"

# Frontend Setup
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
else
    echo "npm dependencies already installed"
fi

echo "✅ Frontend setup completed!"

# Environment files
echo ""
echo "📝 Checking environment files..."
cd ..

if [ ! -f "backend/.env" ]; then
    echo "Creating backend .env file..."
    cat > backend/.env << EOF
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF
    echo "✅ Created backend/.env (update SECRET_KEY in production!)"
fi

if [ ! -f "frontend/.env" ]; then
    echo "Creating frontend .env file..."
    cat > frontend/.env << EOF
VITE_API_URL=http://localhost:8000
EOF
    echo "✅ Created frontend/.env"
fi

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo ""
echo "To start developing:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python app/main.py"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""
echo "API Documentation: http://localhost:8000/api/docs"
echo ""
