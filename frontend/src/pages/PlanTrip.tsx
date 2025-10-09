import { useState } from 'react';
import { motion } from 'framer-motion';
import TripPlanner from '../components/TripPlanner';
import TripSummary from '../components/TripSummary';
import { mockPlanTrip, saveTrip } from '../api/mockData';
import { TripFormData, TripData } from '../types';
import { ArrowLeft } from 'lucide-react';

export default function PlanTrip() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<TripData | null>(null);

  const handlePlanTrip = async (formData: TripFormData) => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const trip = mockPlanTrip(formData);
    saveTrip(trip);
    setCurrentTrip(trip);
    setIsLoading(false);

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setCurrentTrip(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            Create Your Dream Trip
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fill in your preferences and let our AI assistant craft the perfect itinerary
          </p>
        </motion.div>

        <TripPlanner onSubmit={handlePlanTrip} isLoading={isLoading} />

        {currentTrip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
          >
            <TripSummary trip={currentTrip} />

            <div className="text-center mt-8">
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all border border-blue-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Plan Another Trip
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
