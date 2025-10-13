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
  plan: any;
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

    const response = await fetch(`${API_BASE_URL}/mock-plan/trip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: TripResponse = await response.json();
    
    // Transform backend response to frontend format
    return transformTripResponse(result);
  } catch (error) {
    console.error('Error planning trip:', error);
    throw error;
  }
};

const transformTripResponse = (response: TripResponse): TripData => {
  // Transform the backend response to match frontend TripData interface
  const itinerary = response.plan?.itinerary || [];
  const costBreakdown = response.cost_breakdown || {};
  
  return {
    id: response.id.toString(),
    destination: response.destination,
    startDate: response.start_date,
    endDate: response.end_date,
    budget: response.budget,
    interests: [], // Will be populated from preferences
    weather: 'Sunny, 25°C', // Default weather - could be enhanced
    costEstimate: costBreakdown.total || response.budget * 0.8,
    itinerary: itinerary.map((item: any, index: number) => ({
      day: index + 1,
      activity: item.title || item.activity || `Day ${index + 1} Activity`,
      description: item.description || `Enjoy your time in ${response.destination}`,
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
