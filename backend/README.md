# Travel Assistant Agent - Backend

A production-grade FastAPI backend for AI-powered travel planning with multi-agent architecture.

## Features

- **AI-Powered Trip Planning**: Multi-agent system using CrewAI for intelligent travel planning
- **Weather Integration**: Real-time weather data and forecasts
- **Flight Search**: Integration with flight APIs for booking options
- **Hotel Search**: Comprehensive accommodation search and recommendations
- **Cost Calculation**: Intelligent budget planning and optimization
- **Contact Management**: Customer support and inquiry handling
- **Structured Logging**: Comprehensive logging with Loguru
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation

## Architecture

### Multi-Agent System
- **Researcher Agent**: Gathers destination information, attractions, and travel data
- **Planner Agent**: Creates personalized itineraries based on preferences
- **Summarizer Agent**: Generates human-readable travel summaries

### Core Components
- **Tools**: Weather, Flight, Hotel, and Cost Calculation tools
- **Memory**: Conversation and vector memory for personalized experiences
- **RAG**: Retrieval-Augmented Generation for enhanced recommendations

## Quick Start

### Prerequisites
- Python 3.10+
- pip or conda

### Installation

1. **Clone and navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. **Run the server**
```bash
python -m app.main
```

The API will be available at:
- **Server**: http://127.0.0.1:8001
- **Documentation**: http://127.0.0.1:8001/docs
- **Health Check**: http://127.0.0.1:8001/api/v1/health

## API Endpoints

### Trip Planning
- `POST /api/v1/trip/plan` - Plan a complete trip
- `GET /api/v1/trip/` - Get all trips
- `GET /api/v1/trip/{id}` - Get specific trip
- `PUT /api/v1/trip/{id}` - Update trip
- `DELETE /api/v1/trip/{id}` - Delete trip

### Contact Management
- `POST /api/v1/contact` - Submit contact message
- `GET /api/v1/contact/messages` - Get all messages (admin)

### System
- `GET /` - API information
- `GET /api/v1/health` - Health check

## Configuration

### Environment Variables (.env)
```env
# API Keys
OPENAI_API_KEY=your_openai_key
OPENWEATHER_API_KEY=your_weather_key
AMADEUS_API_KEY=your_amadeus_key
AMADEUS_API_SECRET=your_amadeus_secret

# Server Configuration
HOST=127.0.0.1
PORT=8001
LOG_LEVEL=INFO

# CORS Origins
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
```

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application
│   ├── config.py              # Configuration settings
│   ├── dependencies.py        # Authentication dependencies
│   │
│   ├── api/routes/            # API route handlers
│   │   └── trip_routes.py     # Trip planning endpoints
│   │
│   ├── core/                  # Core business logic
│   │   ├── agents/            # AI agents
│   │   ├── tools/             # External API tools
│   │   ├── memory/            # Memory management
│   │   ├── rag/               # RAG implementation
│   │   └── utils/             # Utilities and helpers
│   │
│   ├── models/                # Data models
│   │   └── schemas.py         # Pydantic schemas
│   │
│   ├── services/              # Business services
│   │   └── trip_service.py    # Trip planning service
│   │
│   └── tests/                 # Test suite
│
├── requirements.txt           # Python dependencies
├── .env                      # Environment variables
└── README.md                 # This file
```

## Development

### Running Tests
```bash
pytest app/tests/
```

### Code Quality
```bash
# Format code
black app/

# Lint code
flake8 app/

# Type checking
mypy app/
```

### Logging
Logs are written to:
- Console (formatted with colors)
- File: `./logs/app.log` (rotated, compressed)

## Deployment

### Docker
```bash
docker build -t travel-assistant-backend .
docker run -p 8001:8001 travel-assistant-backend
```

### Production Considerations
- Use PostgreSQL or MongoDB for data persistence
- Implement Redis for caching and session management
- Set up proper authentication and authorization
- Configure HTTPS with SSL certificates
- Use environment-specific configuration files
- Implement rate limiting and request validation
- Set up monitoring and alerting

## API Integration

### Frontend Integration
The backend is designed to work with the React + TypeScript frontend at `http://localhost:5173`.

### External APIs
- **OpenWeather API**: Weather data and forecasts
- **Amadeus API**: Flight search and booking
- **OpenAI API**: AI-powered content generation
- **Custom Hotel APIs**: Accommodation search

## Support

For issues and questions:
1. Check the API documentation at `/docs`
2. Review logs in `./logs/app.log`
3. Ensure all environment variables are set correctly
4. Verify API keys are valid and have proper permissions

## License

This project is part of the Travel Assistant Agent system.