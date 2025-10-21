import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Cloud, CheckCircle, Plane, Building, Users, Star, Clock, Thermometer, Wind, Eye, Droplets, Camera, Utensils, ShoppingBag, Landmark, TrendingUp, Award, Globe } from 'lucide-react';
import { TripData } from '../types';

interface TripSummaryProps {
  trip: TripData;
}

export default function TripSummary({ trip }: TripSummaryProps) {
  const startDate = new Date(trip.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const endDate = new Date(trip.endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const duration = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const budgetStatus = trip.costEstimate <= trip.budget;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
      >
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8">
              <div className="mb-4 sm:mb-6 lg:mb-0">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4"
                >
                  {trip.from ? `${trip.from} → ${trip.destination}` : trip.destination}
                </motion.h1>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-blue-100 mb-3 sm:mb-4">
                  <span className="flex items-center text-sm sm:text-base lg:text-lg">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {startDate} - {endDate}
                  </span>
                  <span className="flex items-center text-sm sm:text-base lg:text-lg">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {duration} Days
                  </span>
                  <span className="flex items-center text-sm sm:text-base lg:text-lg">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {trip.travelers === 1 ? 'Solo Adventure' : `${trip.travelers} Travelers`}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {trip.interests?.map((interest, index) => (
                    <span key={index} className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-center lg:text-right">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="text-sm text-blue-100 mb-2">Total Investment</div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">${trip.costEstimate.toLocaleString()}</div>
                  <div className="text-sm text-blue-200 mb-3">of ${trip.budget.toLocaleString()} budget</div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    budgetStatus 
                      ? 'bg-green-500/20 text-green-100' 
                      : 'bg-yellow-500/20 text-yellow-100'
                  }`}>
                    {budgetStatus ? '✓ Within Budget' : '⚠ Over Budget'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              <span className="text-2xl sm:text-3xl">🌤️</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Weather</h3>
            <p className="text-sm text-gray-600">{trip.weather || 'Pleasant conditions expected'}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <Plane className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
              <span className="text-2xl sm:text-3xl">✈️</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Flights</h3>
            <p className="text-sm text-gray-600">
              {trip.flights && trip.flights.length > 0 
                ? `From $${Math.min(...trip.flights.map((f: any) => f.price))}`
                : 'Multiple options available'}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <Building className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              <span className="text-2xl sm:text-3xl">🏨</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Hotels</h3>
            <p className="text-sm text-gray-600">
              {trip.hotels && trip.hotels.length > 0 
                ? `From $${Math.min(...trip.hotels.map((h: any) => h.price_per_night))}/night`
                : 'Premium accommodations'}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              <span className="text-2xl sm:text-3xl">⭐</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Experience</h3>
            <p className="text-sm text-gray-600">AI-Enhanced Premium</p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Itinerary */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-green-600" />
                Day-by-Day Itinerary
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {trip.itinerary?.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="relative"
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4 lg:space-x-6 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl hover:shadow-md transition-all duration-300">
                      <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                          {day.activity}
                        </h3>
                        {day.description && (
                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-3">{day.description}</p>
                        )}
                        
                        {(day.morning || day.afternoon || day.evening) && (
                          <div className="space-y-3">
                            {day.morning && (
                              <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-l-4 border-orange-400">
                                <div className="flex items-center mb-1">
                                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                                  <span className="font-semibold text-orange-700 text-sm">Morning (9:00 AM - 12:00 PM)</span>
                                </div>
                                <p className="text-gray-700 ml-5 text-sm">{day.morning}</p>
                              </div>
                            )}
                            
                            {day.afternoon && (
                              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                                <div className="flex items-center mb-1">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                  <span className="font-semibold text-blue-700 text-sm">Afternoon (1:00 PM - 5:00 PM)</span>
                                </div>
                                <p className="text-gray-700 ml-5 text-sm">{day.afternoon}</p>
                              </div>
                            )}
                            
                            {day.evening && (
                              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-400">
                                <div className="flex items-center mb-1">
                                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                  <span className="font-semibold text-purple-700 text-sm">Evening (6:00 PM - 9:00 PM)</span>
                                </div>
                                <p className="text-gray-700 ml-5 text-sm">{day.evening}</p>
                              </div>
                            )}
                            
                            {day.estimated_cost && (
                              <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center justify-center">
                                  <span className="text-green-700 font-semibold text-sm">Daily Budget: ${day.estimated_cost}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Flight & Hotel Details */}
            {trip.flights && trip.flights.length > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Plane className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-blue-600" />
                  Flight Options
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {trip.flights.slice(0, 4).map((flight: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-bold text-base sm:text-lg text-gray-900">{flight.airline}</div>
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">${flight.price}</div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
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

            {trip.hotels && trip.hotels.length > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Building className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-purple-600" />
                  Accommodation Options
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {trip.hotels.slice(0, 4).map((hotel: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="font-bold text-base sm:text-lg text-gray-900">{hotel.name}</div>
                          <div className="text-sm text-gray-600 flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            {hotel.rating} {hotel.reviews_count && `(${hotel.reviews_count.toLocaleString()} reviews)`}
                          </div>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-purple-600">${hotel.price_per_night}/night</div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
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
          </div>

          {/* Right Column - Weather & Insights */}
          <div className="space-y-6 lg:space-y-8">
            {/* Weather Details */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <Cloud className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-green-600" />
                Weather Forecast
              </h2>
              
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Thermometer className="w-5 h-5 mr-2 text-red-500" />
                  Current Conditions
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center text-sm sm:text-base">
                      <MapPin className="w-4 h-4 mr-1" />Location:
                    </span>
                    <span className="font-medium text-sm sm:text-base">{trip.weatherDetails?.location || trip.destination}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center text-sm sm:text-base">
                      <Thermometer className="w-4 h-4 mr-1" />Temperature:
                    </span>
                    <span className="font-medium text-base sm:text-lg">
                      {trip.weatherDetails?.temperature || '22°C'}
                      {trip.weatherDetails?.feels_like && (
                        <span className="text-sm text-gray-500 ml-1">(feels {trip.weatherDetails.feels_like})</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center text-sm sm:text-base">
                      <Cloud className="w-4 h-4 mr-1" />Condition:
                    </span>
                    <span className="font-medium text-sm sm:text-base">{trip.weatherDetails?.description || trip.weatherDetails?.condition || 'Clear Sky'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center text-sm sm:text-base">
                      <Droplets className="w-4 h-4 mr-1" />Humidity:
                    </span>
                    <span className="font-medium text-sm sm:text-base">{trip.weatherDetails?.humidity || '65%'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center text-sm sm:text-base">
                      <Wind className="w-4 h-4 mr-1" />Wind:
                    </span>
                    <span className="font-medium text-sm sm:text-base">{trip.weatherDetails?.wind_speed || '3.2 m/s'}</span>
                  </div>
                  {(trip.weatherDetails?.visibility || true) && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center text-sm sm:text-base">
                        <Eye className="w-4 h-4 mr-1" />Visibility:
                      </span>
                      <span className="font-medium text-sm sm:text-base">{trip.weatherDetails?.visibility || '10.0 km'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  5-Day Forecast
                </h3>
                {trip.weatherDetails?.daily_forecast && trip.weatherDetails.daily_forecast.length > 0 ? (
                  trip.weatherDetails.daily_forecast.slice(0, 5).map((day: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">{day.date}</span>
                      <div className="text-right">
                        <div className="font-medium text-sm sm:text-base">{day.high_temp} / {day.low_temp}</div>
                        <div className="text-xs text-gray-500">{day.condition}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { date: 'Today', high: '25°C', low: '18°C', condition: 'Sunny' },
                      { date: 'Tomorrow', high: '23°C', low: '16°C', condition: 'Partly Cloudy' },
                      { date: 'Day 3', high: '21°C', low: '15°C', condition: 'Light Rain' },
                      { date: 'Day 4', high: '24°C', low: '17°C', condition: 'Sunny' },
                      { date: 'Day 5', high: '26°C', low: '19°C', condition: 'Clear' }
                    ].map((day, index) => (
                      <div key={index} className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-sm sm:text-base">{day.date}</span>
                        <div className="text-right">
                          <div className="font-medium text-sm sm:text-base">{day.high} / {day.low}</div>
                          <div className="text-xs text-gray-500">{day.condition}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Trip Preferences */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-blue-600" />
                Trip Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Route:</span>
                    <span className="font-bold">{trip.from} → {trip.destination}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Travelers:</span>
                    <span className="font-bold">{trip.travelers} {trip.travelers === 1 ? 'Person' : 'People'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Travel Style:</span>
                    <span className="font-bold capitalize">{trip.travelStyle?.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Accommodation:</span>
                    <span className="font-bold capitalize">{trip.accommodation}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Transportation:</span>
                    <span className="font-bold capitalize">{trip.transportation}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Meal Preference:</span>
                    <span className="font-bold capitalize">{trip.mealPreference?.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Activity Level:</span>
                    <span className="font-bold capitalize">{trip.activityLevel}</span>
                  </div>
                </div>
              </div>
              
              {trip.specialRequests && (
                <div className="mt-4 sm:mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Special Requests:</h3>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{trip.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Destination Highlights */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <Landmark className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-orange-600" />
                Destination Highlights
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-pink-500" />
                    Must-See Attractions
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                      Historic landmarks and monuments
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                      World-class museums and galleries
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                      Scenic viewpoints and parks
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Utensils className="w-5 h-5 mr-2 text-green-500" />
                    Local Cuisine
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Traditional local specialties
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Fine dining experiences
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Street food and markets
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-purple-500" />
                    Shopping & Activities
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                      Local markets and boutiques
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                      Cultural experiences
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                      Entertainment and nightlife
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                <Globe className="w-6 h-6 sm:w-7 sm:h-7 mr-3" />
                AI Travel Intelligence
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm sm:text-base">Real-time Data Integration</div>
                    <div className="text-xs sm:text-sm text-blue-100">Live weather, flights, and hotel pricing</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm sm:text-base">Personalized Recommendations</div>
                    <div className="text-xs sm:text-sm text-blue-100">Optimized for: {trip.interests?.join(', ') || 'your preferences'}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm sm:text-base">Smart Budget Planning</div>
                    <div className="text-xs sm:text-sm text-blue-100">Cost-optimized itinerary within your budget</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 text-green-300 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm sm:text-base">Local Insights</div>
                    <div className="text-xs sm:text-sm text-blue-100">Hidden gems and authentic experiences</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}