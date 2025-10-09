import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Cloud, CheckCircle } from 'lucide-react';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 mb-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold mb-2">{trip.destination}</h2>
            <div className="flex items-center text-blue-100 space-x-4">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {startDate} - {endDate}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100 mb-1">Estimated Cost</div>
            <div className="text-3xl font-bold">${trip.costEstimate.toLocaleString()}</div>
            <div className="text-sm text-blue-100">of ${trip.budget.toLocaleString()} budget</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center text-blue-100 mb-2">
              <Cloud className="w-5 h-5 mr-2" />
              Weather Forecast
            </div>
            <div className="text-xl font-semibold">{trip.weather}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center text-blue-100 mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              Your Interests
            </div>
            <div className="flex flex-wrap gap-2">
              {trip.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
          Your Day-by-Day Itinerary
        </h3>

        <div className="space-y-4">
          {trip.itinerary.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                {day.day}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {day.activity}
                </h4>
                {day.description && (
                  <p className="text-gray-600">{day.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h4 className="font-semibold text-gray-900 mb-2">Travel Tips</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
              Book accommodations in advance for better rates
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
              Check visa requirements and travel insurance options
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
              Download offline maps and translation apps
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
