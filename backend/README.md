# Travel Assistant Agent Backend

A production-grade FastAPI backend for an AI-powered travel planning system with multi-agent architecture.

## 🏗️ Architecture

The backend uses a multi-agent system with the following components:

- **Researcher Agent**: Fetches data (destinations, weather, flights, hotels)
- **Planner Agent**: Creates structured itineraries using AI logic  
- **Summarizer Agent**: Formats final output with OpenAI or other LLM
- **Orchestrator**: Coordinates the entire planning pipeline

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Redis (for caching and sessions)
- OpenAI API key

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

5. **Start Redis (if not using Docker):**
   ```bash
   redis-server
   ```

6. **Run the application:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Using Docker

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Or build Docker image manually:**
   ```bash
   docker build -t travel-assistant-backend .
   docker run -p 8000:8000 travel-assistant-backend
   ```

## 📚 API Documentation

Once running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## 🔗 API Endpoints

### Core Endpoints

- `POST /api/v1/plan/trip` - Generate trip plan using AI agents
- `GET /api/v1/trips/` - Get all saved trips
- `GET /api/v1/trips/{id}` - Get specific trip details
- `GET /api/v1/health/` - Health check endpoint

### Example Trip Planning Request

```json
{
  "destination": "Paris",
  "start_date": "2024-06-01",
  "end_date": "2024-06-07",
  "budget": 2500.0,
  "travelers": 2,
  "preferences": {
    "interests": ["culture", "food", "art"],
    "comfort_level": "mid_range",
    "travel_style": "cultural"
  }
}
```

## 🧠 Agent System

### Researcher Agent
- Fetches weather data for destination
- Searches flight options
- Finds hotel recommendations
- Gathers destination information
- Identifies local attractions

### Planner Agent
- Creates day-by-day itinerary
- Calculates costs and budget compliance
- Optimizes activities based on preferences
- Suggests transportation options

### Summarizer Agent
- Generates comprehensive trip summary
- Creates personalized recommendations
- Provides packing lists
- Formats final output

## 💾 Data Storage

### Database Models
- **Trip**: Complete trip information and plans
- **UserFeedback**: User ratings and feedback
- **ConversationSession**: Chat session tracking
- **APIUsage**: API call monitoring

### Memory Systems
- **ConversationMemory**: Redis-based chat history
- **VectorStore**: ChromaDB for travel knowledge

## 🔧 Configuration

Key environment variables:

```bash
# Required
OPENAI_API_KEY=your_api_key
DATABASE_URL=sqlite:///./travel.db
REDIS_URL=redis://localhost:6379/0

# Optional
WEATHER_API_KEY=your_weather_key
FLIGHT_API_KEY=your_flight_key
HOTEL_API_KEY=your_hotel_key
```

## 🧪 Testing

Run tests:
```bash
pytest tests/
```

Run with coverage:
```bash
pytest --cov=app tests/
```

## 📊 Monitoring

The backend includes:
- Health check endpoints
- API usage tracking
- Performance metrics
- Error logging
- System resource monitoring

## 🔒 Security

- Input validation and sanitization
- CORS configuration
- Rate limiting (configurable)
- SQL injection prevention
- XSS protection

## 🚀 Production Deployment

### Using Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
1. Set production environment variables
2. Use a production WSGI server (Gunicorn)
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates
5. Configure monitoring and logging

## 🤝 Frontend Integration

The backend is designed to work with the React + TypeScript frontend:

- CORS configured for `http://localhost:5173`
- RESTful API design
- JSON request/response format
- Error handling with proper HTTP status codes

## 📈 Performance

- Async/await throughout for non-blocking operations
- Database connection pooling
- Redis caching for sessions
- Vector database for fast similarity search
- Parallel API calls for data gathering

## 🛠️ Development

### Code Structure
```
app/
├── main.py              # FastAPI application entry point
├── core/
│   └── config.py        # Configuration management
├── api/v1/
│   ├── router.py        # API router
│   └── endpoints/       # API endpoints
├── agents/              # AI agent implementations
├── services/            # External service integrations
├── memory/              # Memory and storage systems
├── models/              # Database models
├── schemas/             # Pydantic schemas
├── db/                  # Database configuration
└── utils/               # Utility functions
```

### Adding New Features
1. Create new endpoint in `api/v1/endpoints/`
2. Add corresponding schema in `schemas/`
3. Update database models if needed
4. Add tests in `tests/`
5. Update documentation

## 📝 License

This project is part of the Travel Assistant System.

## 🆘 Support

For issues and questions:
1. Check the API documentation at `/docs`
2. Review the logs in `travel_assistant.log`
3. Check the health endpoint at `/api/v1/health/`
4. Verify environment configuration
