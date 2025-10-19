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
      return transformTripResponse(result.data, formData);
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

const transformTripResponse = (response: any, formData?: TripFormData): TripData => {
  // Transform the backend response to match frontend TripData interface
  console.log('Full response:', response);
  const research = response.research || {};
  const weather = research.weather || {};
  const itinerary = response.itinerary || {};
  const summary = response.summary || {};
  const tripRequest = response.trip_request || {};
  
  // Format weather data from real API
  const weatherInfo = weather.temperature && weather.condition 
    ? `${weather.condition}, ${weather.temperature}` 
    : 'Weather data unavailable';
  
  // Extract API sources information
  const apiSources = response.data_sources || response.api_sources || {};
  const apiKeysUsed = response.api_keys_used || {};
  
  return {
    id: response.trip_id || Date.now().toString(),
    destination: tripRequest.destination || research.destination || formData?.destination || response.destination || 'Paris',
    startDate: tripRequest.start_date || formData?.startDate || new Date().toISOString().split('T')[0],
    endDate: tripRequest.end_date || formData?.endDate || new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
    budget: tripRequest.budget || formData?.budget || itinerary.estimated_cost || 1000,
    interests: tripRequest.interests || formData?.interests || itinerary.activities || [],
    weather: weatherInfo,
    costEstimate: itinerary.estimated_cost || formData?.budget || 1000,
    itinerary: (() => {
      // Try multiple sources for itinerary data
      const dailyPlan = itinerary.daily_plan || summary.daily_plan || [];
      const activities = itinerary.activities || [];
      
      console.log('Daily plan:', dailyPlan);
      console.log('Activities:', activities);
      
      if (dailyPlan && dailyPlan.length > 0) {
        return dailyPlan.map((day: any, index: number) => ({
          day: day.day || index + 1,
          activity: day.morning || day.activity || `Day ${index + 1} Activities`,
          description: `Morning: ${day.morning || 'Planned activities'} | Afternoon: ${day.afternoon || 'Exploration'} | Evening: ${day.evening || 'Local experiences'} | Cost: $${day.estimated_cost || 90}`
        }));
      }
      
      if (activities && activities.length > 0) {
        return activities.map((activity: any, index: number) => ({
          day: index + 1,
          activity: typeof activity === 'string' ? activity : activity.name || 'Planned Activity',
          description: `Enjoy ${typeof activity === 'string' ? activity.toLowerCase() : 'your planned activities'} in ${formData?.destination || research.destination || 'your destination'}`
        }));
      }
      
      // Fallback itinerary using form data
      const duration = formData ? Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 3;
      const dest = formData?.destination || research.destination || 'your destination';
      return Array.from({ length: duration }, (_, index) => ({
        day: index + 1,
        activity: `Day ${index + 1}: Explore ${dest}`,
        description: `Discover the best of ${dest} with curated activities and local experiences`
      }));
    })(),
    createdAt: new Date().toISOString(),
    // Add real API data
    flights: research.flights || [],
    hotels: research.hotels || [],
    weatherDetails: response.weather_data || weather || null,
    research: research,
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
      return result.data.trips.map((trip: any) => {
        console.log('Raw trip data:', trip);
        return {
          id: trip.id?.toString() || Date.now().toString(),
          destination: trip.destination || 'Paris',
          startDate: trip.start_date || new Date().toISOString().split('T')[0],
          endDate: trip.end_date || new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
          budget: trip.budget || 1000,
          interests: trip.interests || ['culture', 'food'],
          weather: 'Pleasant weather expected',
          costEstimate: trip.cost_breakdown?.total || trip.budget || 1000,
          itinerary: Array.from({length: 3}, (_, i) => ({
            day: i + 1,
            activity: `Day ${i + 1}: Explore ${trip.destination || 'Paris'}`,
            description: `Discover amazing experiences on day ${i + 1}`
          })),
          createdAt: trip.created_at || new Date().toISOString(),
          flights: [],
          hotels: [],
          weatherDetails: null,
          research: null
        };
      });
    }
    return [];
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }
};

export const deleteTrip = async (tripId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/trip/${tripId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting trip:', error);
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
