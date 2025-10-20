export interface TripData {
  id: string;
  from: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  interests: string[];
  weather: string;
  costEstimate: number;
  itinerary: DailyActivity[];
  createdAt: string;
  travelers: number;
  travelStyle: string;
  accommodation: string;
  transportation: string;
  mealPreference: string;
  activityLevel: string;
  specialRequests?: string;
  apiSources?: Record<string, string>;
  apiKeysUsed?: Record<string, boolean>;
  aiGenerated?: boolean;
  dataQuality?: {
    weather: string;
    flights: string;
    hotels: string;
    itinerary: string;
  };
  flights?: FlightSuggestion[];
  hotels?: AccommodationSuggestion[];
  weatherDetails?: WeatherDetails;
  research?: ResearchData;
  costBreakdown?: {
    flights: number;
    hotels: number;
    activities: number;
    food: number;
  };
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

export interface WeatherDetails {
  humidity?: number;
  windSpeedKph?: number;
  precipitationMm?: number;
  hourly?: WeatherData[];
  sunrise?: string;
  sunset?: string;
  // raw holds any additional provider-specific data in a typed-safe way
  raw?: Record<string, unknown>;
}

export interface TripFormData {
  from: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  interests: string[];
  travelers: number;
  travelStyle: string;
  accommodation: string;
  transportation: string;
  mealPreference: string;
  activityLevel: string;
  specialRequests?: string;
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

export interface ResearchData {
  // short human-readable summary of research findings
  summary?: string;
  // list of source URLs or identifiers used during research
  sources?: string[];
  // queries or prompts used to obtain the research
  queries?: string[];
  // any free-form notes or metadata about the research
  notes?: string;
  // ISO timestamp when research was last fetched or updated
  lastFetched?: string;
  // provider-specific raw data kept in a typed-safe map
  raw?: Record<string, unknown>;
}
