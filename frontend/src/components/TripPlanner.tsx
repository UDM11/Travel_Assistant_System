import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, MapPin, Heart, Loader2, Users, Plane, Building, Utensils, Activity, MessageSquare } from 'lucide-react';
import { TripFormData } from '../types';

interface TripPlannerProps {
  onSubmit: (formData: TripFormData) => void;
  isLoading?: boolean;
}

const interestOptions = [
  'adventure',
  'culture',
  'relaxation',
  'food',
  'nature',
  'shopping',
  'photography',
  'history',
  'nightlife',
  'wellness',
];

const travelStyleOptions = [
  { value: 'budget', label: 'Budget Traveler', desc: 'Affordable options, hostels, local transport' },
  { value: 'mid-range', label: 'Comfort Seeker', desc: 'Balance of comfort and value' },
  { value: 'luxury', label: 'Luxury Experience', desc: 'Premium accommodations and services' },
];

const accommodationOptions = [
  { value: 'hotel', label: 'Hotels' },
  { value: 'resort', label: 'Resorts' },
  { value: 'hostel', label: 'Hostels' },
  { value: 'apartment', label: 'Apartments' },
  { value: 'villa', label: 'Villas' },
];

const transportationOptions = [
  { value: 'flight', label: 'Flights' },
  { value: 'train', label: 'Train' },
  { value: 'bus', label: 'Bus' },
  { value: 'car', label: 'Car Rental' },
  { value: 'mixed', label: 'Mixed Transport' },
];

const mealOptions = [
  { value: 'all', label: 'All Cuisines' },
  { value: 'local', label: 'Local Specialties' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'halal', label: 'Halal' },
];

const activityLevelOptions = [
  { value: 'relaxed', label: 'Relaxed', desc: 'Leisurely pace, plenty of rest time' },
  { value: 'moderate', label: 'Moderate', desc: 'Balanced mix of activities and relaxation' },
  { value: 'active', label: 'Active', desc: 'Packed schedule, lots of activities' },
];

export default function TripPlanner({ onSubmit, isLoading = false }: TripPlannerProps) {
  const [formData, setFormData] = useState<TripFormData>({
    from: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 1000,
    interests: [],
    travelers: 1,
    travelStyle: 'mid-range',
    accommodation: 'hotel',
    transportation: 'flight',
    mealPreference: 'all',
    activityLevel: 'moderate',
    specialRequests: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Plan Your Perfect Trip
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mr-2 text-green-600" />
              From (Departure City)
            </label>
            <input
              type="text"
              required
              value={formData.from}
              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., New York, London, Mumbai"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
              To (Destination)
            </label>
            <input
              type="text"
              required
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Paris, Tokyo, Bali"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              Start Date
            </label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Select start date"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              End Date
            </label>
            <input
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Select end date"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 mr-2 text-blue-600" />
              Number of Travelers
            </label>
            <select
              value={formData.travelers}
              onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
              Budget (USD)
            </label>
            <input
              type="number"
              required
              min="100"
              step="50"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="1000"
            />
            <div className="mt-2 text-sm text-gray-500">
              Total: ${formData.budget.toLocaleString()} • Per person: ${Math.round(formData.budget / formData.travelers).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Activity className="w-4 h-4 mr-2 text-blue-600" />
            Travel Style
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {travelStyleOptions.map((style) => (
              <motion.div
                key={style.value}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.travelStyle === style.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFormData({ ...formData, travelStyle: style.value })}
              >
                <div className="font-medium text-gray-900">{style.label}</div>
                <div className="text-sm text-gray-600 mt-1">{style.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Accommodation & Transportation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Building className="w-4 h-4 mr-2 text-blue-600" />
              Accommodation Preference
            </label>
            <select
              value={formData.accommodation}
              onChange={(e) => setFormData({ ...formData, accommodation: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {accommodationOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Plane className="w-4 h-4 mr-2 text-blue-600" />
              Transportation
            </label>
            <select
              value={formData.transportation}
              onChange={(e) => setFormData({ ...formData, transportation: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {transportationOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Meal Preference & Activity Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Utensils className="w-4 h-4 mr-2 text-blue-600" />
              Meal Preference
            </label>
            <select
              value={formData.mealPreference}
              onChange={(e) => setFormData({ ...formData, mealPreference: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {mealOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Activity className="w-4 h-4 mr-2 text-blue-600" />
              Activity Level
            </label>
            <select
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {activityLevelOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label} - {option.desc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Travel Interests */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Heart className="w-4 h-4 mr-2 text-blue-600" />
            Travel Interests
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {interestOptions.map((interest) => (
              <motion.button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  formData.interests.includes(interest)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {interest.charAt(0).toUpperCase() + interest.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
            Special Requests (Optional)
          </label>
          <textarea
            value={formData.specialRequests}
            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            rows={3}
            placeholder="Any special requirements, accessibility needs, or specific requests..."
          />
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Your Perfect Trip...
            </>
          ) : (
            'Generate Itinerary'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
