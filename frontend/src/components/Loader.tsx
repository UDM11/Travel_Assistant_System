import React from 'react';
import { Plane, Globe } from 'lucide-react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto">
            <Globe className="h-12 w-12 text-white animate-spin" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Plane className="h-8 w-8 text-blue-600 animate-bounce" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Planning Your Perfect Trip
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Our AI assistant is analyzing destinations, finding the best activities, 
          and creating your personalized itinerary...
        </p>
        
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;