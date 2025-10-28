"""
Hotel API Configuration and Constants
Professional configuration management for Amadeus Hotels API integration.
"""

from typing import Dict, List
from dataclasses import dataclass

@dataclass
class HotelAPIConfig:
    """Configuration class for Hotel API settings."""
    
    # API Endpoints
    BASE_URL: str = "https://test.api.amadeus.com/v1"
    PRODUCTION_URL: str = "https://api.amadeus.com/v1"
    TOKEN_URL: str = "https://test.api.amadeus.com/v1/security/oauth2/token"
    PRODUCTION_TOKEN_URL: str = "https://api.amadeus.com/v1/security/oauth2/token"
    
    # Rate Limiting
    MAX_REQUESTS_PER_MINUTE: int = 60
    MAX_REQUESTS_PER_HOUR: int = 1000
    
    # Search Parameters
    DEFAULT_RESULTS_LIMIT: int = 20
    MAX_RESULTS_LIMIT: int = 50
    DEFAULT_ADULTS: int = 2
    DEFAULT_ROOMS: int = 1
    
    # Timeout Settings
    REQUEST_TIMEOUT: int = 30
    TOKEN_REFRESH_BUFFER: int = 60  # Refresh token 60 seconds before expiry
    
    # Supported Currencies
    SUPPORTED_CURRENCIES: List[str] = [
        'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK', 'NZD'
    ]
    
    # Hotel Rating Scale
    MIN_RATING: float = 0.0
    MAX_RATING: float = 5.0
    
    # Search Filters
    SUPPORTED_AMENITIES: List[str] = [
        'WIFI', 'PARKING', 'POOL', 'GYM', 'SPA', 'RESTAURANT', 'BAR',
        'ROOM_SERVICE', 'CONCIERGE', 'BUSINESS_CENTER', 'PET_FRIENDLY',
        'AIRPORT_SHUTTLE', 'LAUNDRY', 'AIR_CONDITIONING'
    ]
    
    # Error Messages
    ERROR_MESSAGES: Dict[str, str] = {
        'NO_CREDENTIALS': 'Missing API credentials. Please set HOTELS_API_KEY and HOTELS_CLIENT_SECRET.',
        'AUTH_FAILED': 'Authentication with Amadeus API failed.',
        'NO_RESULTS': 'No hotels found for the specified criteria.',
        'INVALID_DATES': 'Invalid check-in or check-out dates.',
        'LOCATION_NOT_FOUND': 'Could not find the specified location.',
        'API_ERROR': 'Hotel API service is currently unavailable.',
        'RATE_LIMIT': 'API rate limit exceeded. Please try again later.',
        'INVALID_HOTEL_ID': 'Invalid hotel ID provided.',
        'BOOKING_FAILED': 'Hotel booking could not be completed.'
    }

# Global configuration instance
HOTEL_CONFIG = HotelAPIConfig()

# Major city codes for fallback
MAJOR_CITY_CODES: Dict[str, str] = {
    # Europe
    'paris': 'PAR', 'london': 'LON', 'rome': 'ROM', 'barcelona': 'BCN',
    'amsterdam': 'AMS', 'berlin': 'BER', 'madrid': 'MAD', 'vienna': 'VIE',
    'prague': 'PRG', 'budapest': 'BUD', 'zurich': 'ZUR', 'stockholm': 'STO',
    'copenhagen': 'CPH', 'oslo': 'OSL', 'helsinki': 'HEL', 'dublin': 'DUB',
    'lisbon': 'LIS', 'athens': 'ATH', 'warsaw': 'WAW', 'moscow': 'MOW',
    
    # North America
    'new york': 'NYC', 'los angeles': 'LAX', 'chicago': 'CHI', 'miami': 'MIA',
    'san francisco': 'SFO', 'las vegas': 'LAS', 'seattle': 'SEA', 'boston': 'BOS',
    'washington': 'WAS', 'toronto': 'YTO', 'vancouver': 'YVR', 'montreal': 'YMQ',
    
    # Asia Pacific
    'tokyo': 'TYO', 'singapore': 'SIN', 'hong kong': 'HKG', 'sydney': 'SYD',
    'melbourne': 'MEL', 'bangkok': 'BKK', 'kuala lumpur': 'KUL', 'jakarta': 'JKT',
    'manila': 'MNL', 'seoul': 'SEL', 'taipei': 'TPE', 'mumbai': 'BOM',
    'delhi': 'DEL', 'bangalore': 'BLR', 'shanghai': 'SHA', 'beijing': 'BJS',
    
    # Middle East & Africa
    'dubai': 'DXB', 'doha': 'DOH', 'abu dhabi': 'AUH', 'riyadh': 'RUH',
    'kuwait': 'KWI', 'cairo': 'CAI', 'johannesburg': 'JNB', 'cape town': 'CPT',
    'casablanca': 'CMN', 'tunis': 'TUN', 'istanbul': 'IST', 'tel aviv': 'TLV',
    
    # South America
    'sao paulo': 'SAO', 'rio de janeiro': 'RIO', 'buenos aires': 'BUE',
    'lima': 'LIM', 'santiago': 'SCL', 'bogota': 'BOG', 'caracas': 'CCS'
}

def get_environment_config(is_production: bool = False) -> Dict[str, str]:
    """Get environment-specific configuration."""
    if is_production:
        return {
            'base_url': HOTEL_CONFIG.PRODUCTION_URL,
            'token_url': HOTEL_CONFIG.PRODUCTION_TOKEN_URL,
            'environment': 'production'
        }
    else:
        return {
            'base_url': HOTEL_CONFIG.BASE_URL,
            'token_url': HOTEL_CONFIG.TOKEN_URL,
            'environment': 'test'
        }

def validate_search_params(check_in: str, check_out: str, adults: int, rooms: int) -> Dict[str, bool]:
    """Validate hotel search parameters."""
    from datetime import datetime
    
    validation = {
        'valid_dates': True,
        'valid_adults': True,
        'valid_rooms': True,
        'future_dates': True
    }
    
    try:
        check_in_date = datetime.strptime(check_in, '%Y-%m-%d')
        check_out_date = datetime.strptime(check_out, '%Y-%m-%d')
        
        if check_in_date >= check_out_date:
            validation['valid_dates'] = False
            
        if check_in_date < datetime.now().date():
            validation['future_dates'] = False
            
    except ValueError:
        validation['valid_dates'] = False
    
    if adults < 1 or adults > 10:
        validation['valid_adults'] = False
        
    if rooms < 1 or rooms > 5:
        validation['valid_rooms'] = False
    
    return validation