import React from 'react';

interface Hotel {
  id?: string;
  name: string;
  price_per_night: number;
  rating: number;
  reviews_count: number;
  amenities: string[];
  location: string;
  address: string;
  room_type: string;
  bed_type: string;
  view: string;
  breakfast: string;
  cancellation: string;
  distance_to_center: string;
  api_source?: string;
}

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{hotel.name}</h3>
          <p className="text-gray-600 text-sm">{hotel.address}</p>
          <p className="text-gray-500 text-xs">{hotel.distance_to_center} from center</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">${hotel.price_per_night}</div>
          <div className="text-sm text-gray-500">per night</div>
        </div>
      </div>

      <div className="flex items-center mb-3">
        <div className="flex items-center">
          <span className="text-yellow-400">★</span>
          <span className="ml-1 font-medium">{hotel.rating.toFixed(1)}</span>
          <span className="ml-2 text-gray-500 text-sm">({hotel.reviews_count} reviews)</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          <strong>Room:</strong> {hotel.room_type} • {hotel.bed_type} • {hotel.view}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Breakfast:</strong> {hotel.breakfast}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Cancellation:</strong> {hotel.cancellation}
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities:</h4>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.slice(0, 6).map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 6 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{hotel.amenities.length - 6} more
            </span>
          )}
        </div>
      </div>

      {hotel.api_source && (
        <div className="text-xs text-gray-400 border-t pt-2">
          Data source: {hotel.api_source}
        </div>
      )}
    </div>
  );
};

export default HotelCard;