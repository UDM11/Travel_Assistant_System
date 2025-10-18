import { TripFormData, TripData } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export interface TripRequest {
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  travelers: number;
  preferences: Record<string, any>;
  interests: string[];
}

export interface TripResponse {
  id: number;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  travelers: number;
  plan: string;
  itinerary: any[];
  cost_breakdown: any;
  created_at: string;
  api_sources?: Record<string, string>;
  api_keys_used?: Record<string, boolean>;
  ai_generated?: boolean;
  data_sources?: Record<string, any>;
}

export const planTrip = async (formData: TripFormData): Promise<TripData> => {
  try {
    const requestData: TripRequest = {
      destination: formData.destination,
      start_date: formData.startDate,
      end_date: formData.endDate,
      budget: formData.budget,
      travelers: 1, // Default to 1 traveler
      preferences: {
        interests: formData.interests,
        budget_range: formData.budget,
        travel_style: 'cultural'
      },
      interests: formData.interests,
    };

    console.log('Sending request to:', `${API_BASE_URL}/mock-plan/trip`);
    console.log('Request data:', requestData);

    const response = await fetch(`${API_BASE_URL}/plan-trip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result: TripResponse = await response.json();
    console.log('API Response:', result);
    
    // Transform backend response to frontend format
    if (result.success && result.data) {
      return transformTripResponse(result.data);
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error planning trip:', error);
    if (error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure backend is running on port 8001.');
    }
    throw error;
  }
};

const transformTripResponse = (response: any): TripData => {
  // Transform the backend response to match frontend TripData interface
  const research = response.research || {};
  const weather = research.weather || {};
  const itinerary = response.itinerary || {};
  const summary = response.summary || {};
  
  // Format weather data from real API
  const weatherInfo = weather.temperature && weather.condition 
    ? `${weather.condition}, ${weather.temperature}` 
    : 'Weather data unavailable';
  
  // Extract API sources information
  const apiSources = response.data_sources || response.api_sources || {};
  const apiKeysUsed = response.api_keys_used || {};
  
  return {
    id: response.trip_id || Date.now().toString(),
    destination: research.destination || 'Unknown',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
    budget: itinerary.estimated_cost || 1000,
    interests: itinerary.activities || [],
    weather: weatherInfo,
    costEstimate: itinerary.estimated_cost || 1000,
    itinerary: (itinerary.activities || []).map((activity: string, index: number) => ({
      day: index + 1,
      activity: activity,
      description: `Enjoy ${activity.toLowerCase()} in ${research.destination}`,
    })),
    createdAt: new Date().toISOString(),
    // Add API source information
    apiSources: apiSources,
    apiKeysUsed: apiKeysUsed,
    aiGenerated: itinerary.ai_generated || false,
    dataQuality: {
      weather: apiKeysUsed.weather ? 'Real-time data' : 'Mock data',
      flights: apiKeysUsed.flights ? 'Live pricing' : 'Sample data',
      hotels: apiKeysUsed.hotels ? 'Real availability' : 'Demo data',
      itinerary: apiKeysUsed.openai ? 'AI-generated' : 'Template-based'
    }
  };
};

export const getTripStatus = async (taskId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/plan/status/${taskId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting trip status:', error);
    throw error;
  }
};

export const getAllTrips = async (): Promise<TripData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/trip`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result.success && result.data) {
      return result.data.trips.map(transformTripResponse);
    }
    return [];
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};
