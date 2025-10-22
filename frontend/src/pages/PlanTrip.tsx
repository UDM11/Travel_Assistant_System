import { useState } from 'react';
import { motion } from 'framer-motion';
import TripPlanner from '../components/TripPlanner';
import TripSummary from '../components/TripSummary';
import { planTrip } from '../api/travelApi';
import { TripFormData, TripData } from '../types';
import { ArrowLeft, Sparkles, Globe, Clock, Shield, Users, Star, CheckCircle, Zap, MapPin, Calendar } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Planning',
    description: 'Advanced algorithms create personalized itineraries in seconds'
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: '200+ destinations with local insights and hidden gems'
  },
  {
    icon: Shield,
    title: 'Secure & Trusted',
    description: 'Your data is protected with enterprise-grade security'
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Live pricing, availability, and travel advisories'
  }
];

const stats = [
  { number: '2M+', label: 'Trips Planned', icon: MapPin },
  { number: '4.9/5', label: 'User Rating', icon: Star },
  { number: '200+', label: 'Destinations', icon: Globe },
  { number: '24/7', label: 'Support', icon: Clock }
];

const steps = [
  {
    number: '01',
    title: 'Share Your Vision',
    description: 'Tell us your destination, dates, budget, and travel preferences',
    icon: Calendar
  },
  {
    number: '02',
    title: 'AI Creates Magic',
    description: 'Our advanced AI analyzes millions of data points to craft your perfect trip',
    icon: Sparkles
  },
  {
    number: '03',
    title: 'Customize & Book',
    description: 'Review, modify, and book your personalized itinerary with ease',
    icon: CheckCircle
  }
];

export default function PlanTrip() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<TripData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handlePlanTrip = async (formData: TripFormData) => {
    setIsLoading(true);

    try {
      const trip = await planTrip(formData);
      setCurrentTrip(trip);
    } catch (error) {
      console.error('Failed to plan trip:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to plan trip: ${errorMessage}. Please check your internet connection and try again.`);
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setCurrentTrip(null);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 lg:top-20 left-5 lg:left-10 w-48 lg:w-72 h-48 lg:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-20 lg:top-40 right-5 lg:right-10 w-48 lg:w-72 h-48 lg:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-4 lg:-bottom-8 left-10 lg:left-20 w-48 lg:w-72 h-48 lg:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-3 rounded-full mb-8 border border-blue-200"
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold">AI-Powered Trip Planning</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
              Plan Your
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> Perfect Trip</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Experience the future of travel planning with our advanced AI assistant. Get personalized itineraries, discover hidden gems, and create unforgettable memories.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-8 lg:mb-16"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <Icon className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-2 lg:mb-3 text-blue-600" />
                  <div className="text-xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-gray-600 text-xs lg:text-sm font-medium">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to your dream vacation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="relative text-center"
                >
                  <div className="relative">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Our AI Assistant?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced technology meets personalized travel planning
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 group"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trip Planner Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Start Planning Your Adventure
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fill in your preferences and watch our AI create magic
            </p>
          </motion.div>

          <TripPlanner onSubmit={handlePlanTrip} isLoading={isLoading} />
        </div>
      </section>

      {/* Trip Results */}
      {currentTrip && (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-6 py-3 rounded-full mb-6"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Your Perfect Trip is Ready!</span>
                </motion.div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Your Personalized Itinerary
                </h2>
                <p className="text-xl text-gray-600">
                  Crafted by AI, perfected for you
                </p>
              </div>

              <TripSummary trip={currentTrip} />

              <div className="text-center mt-12">
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Plan Another Adventure
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
