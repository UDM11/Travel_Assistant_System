import { TripFormData, TripData } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8001/api/v1';

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

    const response = await fetch(`${API_BASE_URL}/plan/trip`, {
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
    return transformTripResponse(result);
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
  const itinerary = response.itinerary || [];
  const costBreakdown = response.cost_breakdown || {};
  
  return {
    id: response.id.toString(),
    destination: response.destination,
    startDate: response.start_date,
    endDate: response.end_date,
    budget: response.budget,
    interests: [], // Will be populated from preferences
    weather: 'Sunny, 25°C', // Default weather - could be enhanced
    costEstimate: costBreakdown.total || response.budget,
    itinerary: itinerary.map((item: any, index: number) => ({
      day: item.day || index + 1,
      activity: `Day ${item.day || index + 1}`,
      description: `${item.morning || ''} ${item.afternoon || ''} ${item.evening || ''}`.trim() || `Enjoy your time in ${response.destination}`,
    })),
    createdAt: response.created_at,
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
    const response = await fetch(`${API_BASE_URL}/trips`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.trips.map(transformTripResponse);
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
