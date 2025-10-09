import { TripData, TripFormData } from '../types';

const destinations = {
  paris: { weather: 'Partly Cloudy, 18°C', activities: ['Visit Eiffel Tower', 'Louvre Museum tour', 'Seine River cruise'] },
  tokyo: { weather: 'Clear, 22°C', activities: ['Explore Shibuya district', 'Visit Senso-ji Temple', 'Tsukiji Fish Market'] },
  bali: { weather: 'Sunny, 28°C', activities: ['Beach relaxation at Seminyak', 'Ubud rice terraces', 'Traditional Balinese spa'] },
  newyork: { weather: 'Sunny, 15°C', activities: ['Central Park walk', 'Statue of Liberty visit', 'Broadway show'] },
  london: { weather: 'Rainy, 12°C', activities: ['British Museum', 'Tower of London', 'Thames River walk'] },
  dubai: { weather: 'Hot, 35°C', activities: ['Burj Khalifa visit', 'Desert safari', 'Dubai Mall shopping'] },
  rome: { weather: 'Warm, 25°C', activities: ['Colosseum tour', 'Vatican Museums', 'Trevi Fountain visit'] },
  sydney: { weather: 'Sunny, 24°C', activities: ['Opera House tour', 'Bondi Beach', 'Harbour Bridge climb'] },
};

const interestActivities: Record<string, string[]> = {
  adventure: ['Hiking expedition', 'Zip-lining adventure', 'Scuba diving', 'Rock climbing'],
  culture: ['Local museum visit', 'Traditional dance performance', 'Historical site tour', 'Art gallery exploration'],
  relaxation: ['Spa day', 'Beach lounging', 'Sunset yoga', 'Meditation retreat'],
  food: ['Food market tour', 'Cooking class', 'Wine tasting', 'Street food exploration'],
  nature: ['National park visit', 'Wildlife safari', 'Botanical gardens', 'Mountain trekking'],
  shopping: ['Local markets', 'Designer boutiques', 'Souvenir hunting', 'Craft workshops'],
};

export const mockPlanTrip = (formData: TripFormData): TripData => {
  const { destination, startDate, endDate, budget, interests } = formData;

  const destinationKey = destination.toLowerCase().replace(/\s+/g, '');
  const destData = destinations[destinationKey as keyof typeof destinations] || destinations.paris;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const itinerary = [];
  for (let i = 0; i < Math.min(days, 7); i++) {
    let activity = destData.activities[i % destData.activities.length];

    if (interests.length > 0) {
      const interest = interests[i % interests.length];
      const interestActivity = interestActivities[interest];
      if (interestActivity) {
        activity = interestActivity[Math.floor(Math.random() * interestActivity.length)];
      }
    }

    itinerary.push({
      day: i + 1,
      activity,
      description: `Enjoy a full day of ${activity.toLowerCase()}`,
    });
  }

  const baseCost = days * 150;
  const costEstimate = Math.min(budget - 150, budget * 0.85);

  return {
    id: Date.now().toString(),
    destination,
    startDate,
    endDate,
    budget,
    interests,
    weather: destData.weather,
    costEstimate: Math.round(costEstimate),
    itinerary,
    createdAt: new Date().toISOString(),
  };
};

export const getStoredTrips = (): TripData[] => {
  const stored = localStorage.getItem('recentTrips');
  return stored ? JSON.parse(stored) : [];
};

export const saveTrip = (trip: TripData): void => {
  const trips = getStoredTrips();
  trips.unshift(trip);

  if (trips.length > 10) {
    trips.pop();
  }

  localStorage.setItem('recentTrips', JSON.stringify(trips));
};

export const clearTrips = (): void => {
  localStorage.removeItem('recentTrips');
};
