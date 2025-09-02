import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { generateItinerary } from '../services/api';
import ItineraryCard from '../components/ItineraryCard';
import Loader from '../components/Loader';
import { MapPin, Calendar, DollarSign, Users, Plane, Hotel, MapIcon } from 'lucide-react';

const PlanTrip = () => {
  const { preferences, updatePreferences, tripData, setTripData } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: preferences.budget,
    travelStyle: preferences.travelStyle,
    interests: preferences.interests,
    groupSize: '2'
  });

  const interestOptions = [
    'Culture & History', 'Adventure', 'Food & Cuisine', 'Nature & Wildlife',
    'Art & Museums', 'Nightlife', 'Shopping', 'Photography', 'Architecture',
    'Local Experiences', 'Beaches', 'Mountains'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      return;
    }

    setLoading(true);
    try {
      const userInput = `I want to visit ${formData.destination} from ${formData.startDate} to ${formData.endDate} for ${formData.groupSize} people.`;
      const userPrefs = {
        budget: formData.budget,
        travelStyle: formData.travelStyle,
        interests: formData.interests,
        groupSize: formData.groupSize
      };

      updatePreferences(userPrefs);
      const result = await generateItinerary(userInput, userPrefs);
      setTripData(result);
    } catch (error) {
      console.error('Error generating itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Plan Your Perfect Trip
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tell us about your dream destination and we'll create a personalized itinerary just for you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Planning Form */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MapPin className="h-6 w-6 text-blue-600 mr-2" />
            Trip Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                placeholder="e.g., Paris, France"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="budget">Budget ($50-100/day)</option>
                  <option value="medium">Medium ($100-250/day)</option>
                  <option value="luxury">Luxury ($250+/day)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Size
                </label>
                <select
                  value={formData.groupSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, groupSize: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="1">Solo Traveler</option>
                  <option value="2">Couple</option>
                  <option value="3-4">Small Group (3-4)</option>
                  <option value="5+">Large Group (5+)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Style
              </label>
              <select
                value={formData.travelStyle}
                onChange={(e) => setFormData(prev => ({ ...prev, travelStyle: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="relaxed">Relaxed & Leisurely</option>
                <option value="balanced">Balanced</option>
                <option value="packed">Action-Packed</option>
                <option value="adventure">Adventure Focused</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interests (select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.interests.includes(interest)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate My Itinerary
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {tripData ? (
            <>
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Summary</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">${tripData.totalCost}</div>
                    <div className="text-sm text-gray-600">Total Cost</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{tripData.itinerary?.length || 0}</div>
                    <div className="text-sm text-gray-600">Days</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <MapIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">{tripData.itinerary?.reduce((acc, day) => acc + day.activities?.length || 0, 0) || 0}</div>
                    <div className="text-sm text-gray-600">Activities</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{tripData.summary}</p>
              </div>

              {tripData.itinerary && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Your Itinerary</h3>
                  {tripData.itinerary.map((day, index) => (
                    <ItineraryCard key={index} day={day} />
                  ))}
                </div>
              )}

              {tripData.flights && tripData.flights.length > 0 && (
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Plane className="h-5 w-5 text-blue-600 mr-2" />
                    Recommended Flights
                  </h3>
                  <div className="space-y-3">
                    {tripData.flights.map((flight, index) => (
                      <div key={index} className="p-4 bg-blue-50 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{flight.from} → {flight.to}</span>
                          <span className="text-blue-600 font-bold">${flight.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tripData.hotels && tripData.hotels.length > 0 && (
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Hotel className="h-5 w-5 text-green-600 mr-2" />
                    Recommended Hotels
                  </h3>
                  <div className="space-y-3">
                    {tripData.hotels.map((hotel, index) => (
                      <div key={index} className="p-4 bg-green-50 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{hotel.name}</span>
                          <span className="text-green-600 font-bold">${hotel.price}/night</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tripData.tips && tripData.tips.length > 0 && (
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Travel Tips</h3>
                  <ul className="space-y-2">
                    {tripData.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg p-12 border border-gray-100 text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Explore?</h3>
              <p className="text-gray-600">
                Fill out the form on the left to generate your personalized travel itinerary.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanTrip;