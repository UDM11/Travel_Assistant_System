export interface TripData {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  interests: string[];
  weather: string;
  costEstimate: number;
  itinerary: DailyActivity[];
  createdAt: string;
}

export interface DailyActivity {
  day: number;
  activity: string;
  description?: string;
}

export interface WeatherData {
  temperature: string;
  condition: string;
  icon: string;
}

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  interests: string[];
}

export interface AccommodationSuggestion {
  name: string;
  type: string;
  pricePerNight: number;
  rating: number;
}

export interface FlightSuggestion {
  airline: string;
  price: number;
  duration: string;
}
