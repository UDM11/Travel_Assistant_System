#!/bin/bash

# Travel Assistant Backend Setup Script
# This script sets up the complete backend environment

echo "🚀 Setting up Travel Assistant Backend..."

# Check Python version
python_version=$(python3 --version 2>&1 | grep -o '[0-9]\+\.[0-9]\+')
required_version="3.11"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" = "$required_version" ]; then
    echo "✅ Python version $python_version is compatible"
else
    echo "❌ Python 3.11+ is required. Current version: $python_version"
    exit 1
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p data/chroma
mkdir -p logs

# Copy environment file
if [ ! -f .env ]; then
    echo "⚙️ Creating environment configuration..."
    cp .env.example .env
    echo "📝 Please edit .env file with your API keys and configuration"
else
    echo "✅ Environment file already exists"
fi

# Initialize database
echo "🗄️ Initializing database..."
python -c "from app.db.init_db import init_db; init_db()"

# Run tests
echo "🧪 Running tests..."
python -m pytest tests/ -v

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Start Redis server: redis-server"
echo "3. Run the application: uvicorn app.main:app --reload"
echo "4. Visit http://localhost:8000/docs for API documentation"
echo ""
echo "Or use Docker:"
echo "docker-compose up --build"
