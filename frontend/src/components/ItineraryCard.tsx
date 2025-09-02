import React from 'react';
import { Clock, MapPin, Camera, Utensils } from 'lucide-react';

interface Activity {
  name: string;
  time?: string;
  location?: string;
  type?: string;
  description?: string;
}

interface ItineraryDay {
  day: number;
  date?: string;
  activities: Activity[];
  meals?: string[];
  transportation?: string;
}

interface ItineraryCardProps {
  day: ItineraryDay;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ day }) => {
  const getActivityIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'food':
      case 'restaurant':
      case 'dining':
        return <Utensils className="h-4 w-4 text-orange-600" />;
      case 'sightseeing':
      case 'landmark':
      case 'attraction':
        return <Camera className="h-4 w-4 text-blue-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Day {day.day}
        </h3>
        {day.date && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {day.date}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {day.activities?.map((activity, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-200 group"
          >
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type || '')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {activity.name}
                </h4>
                {activity.time && (
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </span>
                )}
              </div>
              {activity.location && (
                <p className="text-sm text-gray-600 mb-1 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {activity.location}
                </p>
              )}
              {activity.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {activity.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {day.meals && day.meals.length > 0 && (
        <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Utensils className="h-4 w-4 text-orange-600 mr-2" />
            Recommended Dining
          </h4>
          <div className="space-y-1">
            {day.meals.map((meal, index) => (
              <p key={index} className="text-sm text-gray-700">{meal}</p>
            ))}
          </div>
        </div>
      )}

      {day.transportation && (
        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-700 font-medium">
            🚗 Transportation: {day.transportation}
          </p>
        </div>
      )}
    </div>
  );
};

export default ItineraryCard;