@echo off
echo Installing dependencies...
pip install -r requirements.txt

echo Starting Travel Assistant Backend Server...
echo Server will be available at: http://127.0.0.1:8000
echo API Documentation: http://127.0.0.1:8000/docs
echo.
python main.py