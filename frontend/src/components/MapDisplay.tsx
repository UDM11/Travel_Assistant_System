import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface Location {
  name: string;
  lat?: number;
  lng?: number;
  address?: string;
}

interface MapDisplayProps {
  locations: Location[];
  center?: { lat: number; lng: number };
}

const MapDisplay: React.FC<MapDisplayProps> = ({ locations, center }) => {
  // This is a placeholder map component
  // In a real application, you would integrate with Google Maps, Mapbox, or similar
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <Navigation className="h-5 w-5 text-blue-600 mr-2" />
        Trip Map
      </h3>
      
      <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-8 text-center min-h-[300px] flex flex-col justify-center">
        <div className="mb-4">
          <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Interactive Map Coming Soon
          </h4>
          <p className="text-gray-600">
            We're working on an interactive map to show your trip locations and routes.
          </p>
        </div>
        
        {locations.length > 0 && (
          <div className="mt-6">
            <h5 className="font-medium text-gray-900 mb-3">Your Trip Locations:</h5>
            <div className="space-y-2">
              {locations.map((location, index) => (
                <div key={index} className="flex items-center justify-center text-sm text-gray-700">
                  <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                  {location.name}
                  {location.address && <span className="text-gray-500 ml-1">• {location.address}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapDisplay;