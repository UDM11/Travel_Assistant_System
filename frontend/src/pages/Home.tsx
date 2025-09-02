import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Users, ArrowRight, Globe } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: 'Smart Destinations',
      description: 'AI-powered destination recommendations based on your preferences and travel style.'
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: 'Optimized Itineraries',
      description: 'Day-by-day plans that maximize your time and minimize travel stress.'
    },
    {
      icon: <DollarSign className="h-8 w-8 text-orange-600" />,
      title: 'Budget Planning',
      description: 'Transparent cost breakdowns for flights, hotels, activities, and meals.'
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'Personalized Experience',
      description: 'Tailored recommendations for solo travelers, couples, families, and groups.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="py-20 text-center">
        <div className="mb-8">
          <Globe className="h-16 w-16 text-blue-600 mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your AI Travel
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent"> Assistant</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your travel dreams into perfectly planned adventures. Our AI assistant creates 
            personalized itineraries tailored to your style, budget, and interests.
          </p>
        </div>
        
        <Link
          to="/plan"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Start Planning Your Trip
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>

      {/* Features Grid */}
      <div className="py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
          Why Choose TravelAI?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-blue-200"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust TravelAI to plan their perfect trips. 
            Start your journey today.
          </p>
          <Link
            to="/plan"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Plan My Trip Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;