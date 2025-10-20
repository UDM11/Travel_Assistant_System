import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllTrips, deleteTrip } from '../api/travelApi';
import { TripData } from '../types';
import { Calendar, MapPin, DollarSign, Trash2, Inbox, Plane, Building, Cloud, Star, Users, Clock, Eye, TrendingUp, X, CheckCircle } from 'lucide-react';

export default function RecentTrips() {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const fetchedTrips = await getAllTrips();
      setTrips(fetchedTrips);
    } catch (err) {
      setError('Failed to load trips. Make sure the backend server is running.');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTrips();
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await deleteTrip(tripId);
        setTrips(trips.filter(trip => trip.id !== tripId));
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Failed to delete trip. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Recent Trips
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Review your travel plans and get inspired for your next adventure
          </p>
        </motion.div>

        <div className="text-center mb-8">
          <motion.button
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all"
          >
            Refresh Trips
          </motion.button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your trips...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchTrips}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : trips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <Inbox className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No trips yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start planning your first adventure to see it here
            </p>
            <motion.a
              href="/plan"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all"
            >
              Plan Your First Trip
            </motion.a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {trips.map((trip, index) => {
              const duration = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24));
              const budgetStatus = trip.costEstimate <= trip.budget ? 'within' : 'over';
              
              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Enhanced Header */}
                  <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-bold leading-tight">{trip.from ? `${trip.from} → ${trip.destination}` : trip.destination}</h3>
                        <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">{duration}d</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-blue-100 text-sm mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(trip.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        -{' '}
                        {new Date(trip.endDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-blue-100">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-sm">{trip.travelers === 1 ? 'Solo Trip' : `${trip.travelers} Travelers`}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          budgetStatus === 'within' 
                            ? 'bg-green-500/20 text-green-100' 
                            : 'bg-yellow-500/20 text-yellow-100'
                        }`}>
                          {budgetStatus === 'within' ? '✓ On Budget' : '⚠ Over Budget'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="p-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="text-sm text-green-700 font-medium">Total Cost</div>
                        <div className="text-lg font-bold text-green-800">
                          ${trip.costEstimate.toLocaleString()}
                        </div>
                        <div className="text-xs text-green-600">of ${trip.budget.toLocaleString()}</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <MapPin className="w-5 h-5 text-purple-600" />
                          <Star className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="text-sm text-purple-700 font-medium">Activities</div>
                        <div className="text-lg font-bold text-purple-800">
                          {trip.itinerary.length}
                        </div>
                        <div className="text-xs text-purple-600">planned days</div>
                      </div>
                    </div>

                    {/* Services Available */}
                    <div className="mb-6">
                      <div className="text-sm font-medium text-gray-700 mb-3">Services Included</div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                          <Plane className="w-5 h-5 text-blue-600 mb-1" />
                          <span className="text-xs text-blue-700 font-medium">Flights</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
                          <Building className="w-5 h-5 text-purple-600 mb-1" />
                          <span className="text-xs text-purple-700 font-medium">Hotels</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                          <Cloud className="w-5 h-5 text-green-600 mb-1" />
                          <span className="text-xs text-green-700 font-medium">Weather</span>
                        </div>
                      </div>
                    </div>

                    {/* Interests */}
                    {trip.interests.length > 0 && (
                      <div className="mb-6">
                        <div className="text-sm font-medium text-gray-700 mb-3">Your Interests</div>
                        <div className="flex flex-wrap gap-2">
                          {trip.interests.slice(0, 4).map((interest, idx) => (
                            <span
                              key={interest}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                idx % 4 === 0 ? 'bg-blue-100 text-blue-700' :
                                idx % 4 === 1 ? 'bg-purple-100 text-purple-700' :
                                idx % 4 === 2 ? 'bg-green-100 text-green-700' :
                                'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {interest}
                            </span>
                          ))}
                          {trip.interests.length > 4 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                              +{trip.interests.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => setSelectedTrip(trip)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium text-sm hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteTrip(trip.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 bg-red-100 hover:bg-red-200 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {/* Trip Details Modal */}
        {selectedTrip && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedTrip.from ? `${selectedTrip.from} → ${selectedTrip.destination}` : selectedTrip.destination}</h2>
                    <div className="flex items-center text-blue-100">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(selectedTrip.startDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      -{' '}
                      {new Date(selectedTrip.endDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTrip(null)}
                    className="p-2 hover:bg-white/20 rounded-full transition-all"
                    aria-label="Close trip details"
                    title="Close"
                  >
                    <X className="w-6 h-6" />
                    <span className="sr-only">Close</span>
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                {/* Trip Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                    <div className="flex items-center mb-3">
                      <DollarSign className="w-6 h-6 text-green-600 mr-2" />
                      <h3 className="font-semibold text-green-800">Budget Overview</h3>
                    </div>
                    <div className="text-2xl font-bold text-green-800 mb-1">
                      ${selectedTrip.costEstimate.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">of ${selectedTrip.budget.toLocaleString()} budget</div>
                    <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${
                      selectedTrip.costEstimate <= selectedTrip.budget
                        ? 'bg-green-200 text-green-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {selectedTrip.costEstimate <= selectedTrip.budget ? '✓ Within Budget' : '⚠ Over Budget'}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                    <div className="flex items-center mb-3">
                      <Clock className="w-6 h-6 text-blue-600 mr-2" />
                      <h3 className="font-semibold text-blue-800">Trip Duration</h3>
                    </div>
                    <div className="text-2xl font-bold text-blue-800 mb-1">
                      {Math.ceil((new Date(selectedTrip.endDate).getTime() - new Date(selectedTrip.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days
                    </div>
                    <div className="text-sm text-blue-600">{selectedTrip.itinerary.length} activities planned</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl">
                    <div className="flex items-center mb-3">
                      <Star className="w-6 h-6 text-purple-600 mr-2" />
                      <h3 className="font-semibold text-purple-800">Experience Type</h3>
                    </div>
                    <div className="text-lg font-bold text-purple-800 mb-1">Premium Trip</div>
                    <div className="text-sm text-purple-600">AI-enhanced planning</div>
                  </div>
                </div>
                
                {/* Day-by-Day Itinerary */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                    Day-by-Day Itinerary
                  </h3>
                  <div className="space-y-4">
                    {selectedTrip.itinerary.map((day) => (
                      <div key={day.day} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                            {day.day}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-2">
                              {day.activity}
                            </h4>
                            {day.description && (
                              <p className="text-gray-600 leading-relaxed">{day.description}</p>
                            )}
                            {day.morning && (
                              <div className="mt-4 space-y-3">
                                <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-l-4 border-orange-400">
                                  <div className="flex items-center mb-1">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                                    <span className="font-semibold text-orange-700">Morning (9:00 AM - 12:00 PM)</span>
                                  </div>
                                  <p className="text-gray-700 ml-5">{day.morning}</p>
                                </div>
                                
                                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                                  <div className="flex items-center mb-1">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                    <span className="font-semibold text-blue-700">Afternoon (1:00 PM - 5:00 PM)</span>
                                  </div>
                                  <p className="text-gray-700 ml-5">{day.afternoon}</p>
                                </div>
                                
                                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-400">
                                  <div className="flex items-center mb-1">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                    <span className="font-semibold text-purple-700">Evening (6:00 PM - 9:00 PM)</span>
                                  </div>
                                  <p className="text-gray-700 ml-5">{day.evening}</p>
                                </div>
                                
                                {day.estimated_cost && (
                                  <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center justify-center">
                                      <span className="text-green-700 font-semibold">Daily Budget: ${day.estimated_cost}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flight & Hotel Details */}
                {selectedTrip.flights && selectedTrip.flights.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Plane className="w-6 h-6 mr-2 text-blue-600" />
                      Flight Options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTrip.flights.slice(0, 4).map((flight: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-bold text-gray-900">{flight.airline}</div>
                            <div className="text-xl font-bold text-blue-600">${flight.price}</div>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div>{flight.flight_number} • {flight.aircraft}</div>
                            <div>{flight.departure} → {flight.arrival} • {flight.duration}</div>
                            <div>{flight.stops === 0 ? 'Direct Flight' : `${flight.stops} Stop(s)`}</div>
                            {flight.baggage && <div className="text-green-600">✓ {flight.baggage}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTrip.hotels && selectedTrip.hotels.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Building className="w-6 h-6 mr-2 text-purple-600" />
                      Accommodation Options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTrip.hotels.slice(0, 4).map((hotel: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-bold text-gray-900">{hotel.name}</div>
                              <div className="text-sm text-gray-600 flex items-center mt-1">
                                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                {hotel.rating} {hotel.reviews_count && `(${hotel.reviews_count.toLocaleString()} reviews)`}
                              </div>
                            </div>
                            <div className="text-xl font-bold text-purple-600">${hotel.price_per_night}/night</div>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div>{hotel.location} • {hotel.room_type}</div>
                            {hotel.room_size && <div>Room Size: {hotel.room_size}</div>}
                            {hotel.amenities && hotel.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {hotel.amenities.slice(0, 3).map((amenity: string, i: number) => (
                                  <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                    {amenity}
                                  </span>
                                ))}
                                {hotel.amenities.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    +{hotel.amenities.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Trip Preferences */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="w-6 h-6 mr-2 text-blue-600" />
                    Trip Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Route:</span>
                        <span className="font-bold">{selectedTrip.from ? `${selectedTrip.from} → ${selectedTrip.destination}` : selectedTrip.destination}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Travelers:</span>
                        <span className="font-bold">{selectedTrip.travelers} {selectedTrip.travelers === 1 ? 'Person' : 'People'}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Travel Style:</span>
                        <span className="font-bold capitalize">{selectedTrip.travelStyle?.replace('-', ' ')}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Accommodation:</span>
                        <span className="font-bold capitalize">{selectedTrip.accommodation}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Transportation:</span>
                        <span className="font-bold capitalize">{selectedTrip.transportation}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Meal Preference:</span>
                        <span className="font-bold capitalize">{selectedTrip.mealPreference?.replace('-', ' ')}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Activity Level:</span>
                        <span className="font-bold capitalize">{selectedTrip.activityLevel}</span>
                      </div>
                    </div>
                  </div>
                  {selectedTrip.specialRequests && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Special Requests:</h4>
                      <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedTrip.specialRequests}</p>
                    </div>
                  )}
                </div>

                {/* Cost Breakdown */}
                {selectedTrip.costBreakdown && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <DollarSign className="w-6 h-6 mr-2 text-green-600" />
                      Cost Breakdown
                    </h3>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-gray-600 text-sm">Flights</div>
                          <div className="font-bold text-lg text-blue-600">${selectedTrip.costBreakdown.flights}</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-gray-600 text-sm">Hotels</div>
                          <div className="font-bold text-lg text-purple-600">${selectedTrip.costBreakdown.hotels}</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-gray-600 text-sm">Activities</div>
                          <div className="font-bold text-lg text-orange-600">${selectedTrip.costBreakdown.activities}</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-gray-600 text-sm">Food</div>
                          <div className="font-bold text-lg text-red-600">${selectedTrip.costBreakdown.food}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Weather Details */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Cloud className="w-6 h-6 mr-2 text-green-600" />
                    Weather Information
                  </h3>
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-gray-600">Temperature</div>
                        <div className="font-bold text-lg">{selectedTrip.weatherDetails?.temperature || '22°C'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">Condition</div>
                        <div className="font-bold">{selectedTrip.weatherDetails?.condition || 'Clear Sky'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">Humidity</div>
                        <div className="font-bold">{selectedTrip.weatherDetails?.humidity || '65%'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">Wind</div>
                        <div className="font-bold">{selectedTrip.weatherDetails?.wind_speed || '3.2 m/s'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {selectedTrip.research?.recommendations && selectedTrip.research.recommendations.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-6 h-6 mr-2 text-blue-600" />
                      Travel Recommendations
                    </h3>
                    <div className="bg-blue-50 rounded-xl p-6">
                      <ul className="space-y-2">
                        {selectedTrip.research.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Interests & Services */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Your Interests */}
                  {selectedTrip.interests.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Your Interests</h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedTrip.interests.map((interest, idx) => (
                          <span
                            key={interest}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                              idx % 4 === 0 ? 'bg-blue-100 text-blue-700' :
                              idx % 4 === 1 ? 'bg-purple-100 text-purple-700' :
                              idx % 4 === 2 ? 'bg-green-100 text-green-700' :
                              'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Services Included */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Services Included</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <Plane className="w-6 h-6 text-blue-600 mr-3" />
                        <div>
                          <div className="font-medium text-blue-800">Flight Options</div>
                          <div className="text-sm text-blue-600">Multiple airlines available</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                        <Building className="w-6 h-6 text-purple-600 mr-3" />
                        <div>
                          <div className="font-medium text-purple-800">Accommodation</div>
                          <div className="text-sm text-purple-600">Various hotel options</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <Cloud className="w-6 h-6 text-green-600 mr-3" />
                        <div>
                          <div className="font-medium text-green-800">Weather Forecast</div>
                          <div className="text-sm text-green-600">Real-time weather data</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
