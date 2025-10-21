import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, MapPin, Heart, Loader2, Users, Plane, Building, Utensils, Activity, MessageSquare, Search, Clock, Star, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { TripFormData } from '../types';

interface TripPlannerProps {
  onSubmit: (formData: TripFormData) => void;
  isLoading?: boolean;
}

const interestOptions = [
  'adventure',
  'culture',
  'relaxation',
  'food',
  'nature',
  'shopping',
  'photography',
  'history',
  'nightlife',
  'wellness',
];

const travelStyleOptions = [
  { value: 'budget', label: 'Budget Traveler', desc: 'Affordable options, hostels, local transport' },
  { value: 'mid-range', label: 'Comfort Seeker', desc: 'Balance of comfort and value' },
  { value: 'luxury', label: 'Luxury Experience', desc: 'Premium accommodations and services' },
];

const accommodationOptions = [
  { value: 'hotel', label: 'Hotels' },
  { value: 'resort', label: 'Resorts' },
  { value: 'hostel', label: 'Hostels' },
  { value: 'apartment', label: 'Apartments' },
  { value: 'villa', label: 'Villas' },
];

const transportationOptions = [
  { value: 'flight', label: 'Flights' },
  { value: 'train', label: 'Train' },
  { value: 'bus', label: 'Bus' },
  { value: 'car', label: 'Car Rental' },
  { value: 'mixed', label: 'Mixed Transport' },
];

const mealOptions = [
  { value: 'all', label: 'All Cuisines' },
  { value: 'local', label: 'Local Specialties' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'halal', label: 'Halal' },
];

const activityLevelOptions = [
  { value: 'relaxed', label: 'Relaxed', desc: 'Leisurely pace, plenty of rest time' },
  { value: 'moderate', label: 'Moderate', desc: 'Balanced mix of activities and relaxation' },
  { value: 'active', label: 'Active', desc: 'Packed schedule, lots of activities' },
];

export default function TripPlanner({ onSubmit, isLoading = false }: TripPlannerProps) {
  const [formData, setFormData] = useState<TripFormData>({
    from: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 1000,
    interests: [],
    travelers: 1,
    travelStyle: 'mid-range',
    accommodation: 'hotel',
    transportation: 'flight',
    mealPreference: 'all',
    activityLevel: 'moderate',
    specialRequests: '',
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [tripDuration, setTripDuration] = useState(0);

  const steps = [
    { title: 'Destination & Dates', icon: MapPin, fields: ['from', 'destination', 'startDate', 'endDate'] },
    { title: 'Travel Details', icon: Users, fields: ['travelers', 'budget', 'travelStyle'] },
    { title: 'Preferences', icon: Heart, fields: ['accommodation', 'transportation', 'mealPreference', 'activityLevel'] },
    { title: 'Interests & Extras', icon: Sparkles, fields: ['interests', 'specialRequests'] }
  ];

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTripDuration(diffDays);
    }
  }, [formData.startDate, formData.endDate]);

  const isStepComplete = (stepIndex: number) => {
    const step = steps[stepIndex];
    return step.fields.every(field => {
      if (field === 'interests') return formData.interests.length > 0;
      if (field === 'specialRequests') return true; // Optional field
      return formData[field as keyof TripFormData] !== '' && formData[field as keyof TripFormData] !== 0;
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      if (isStepComplete(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-green-600" />
                  From (Departure City)
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., New York, London, Mumbai"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  To (Destination)
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., Paris, Tokyo, Bali"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {tripDuration > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Trip Duration: {tripDuration} days</span>
                </div>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  Number of Travelers
                </label>
                <select
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                  Budget (USD)
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  step="50"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="1000"
                />
                <div className="mt-2 text-sm text-gray-500">
                  Total: ${formData.budget.toLocaleString()} • Per person: ${Math.round(formData.budget / formData.travelers).toLocaleString()}
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Activity className="w-4 h-4 mr-2 text-blue-600" />
                Travel Style
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {travelStyleOptions.map((style) => (
                  <motion.div
                    key={style.value}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.travelStyle === style.value
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, travelStyle: style.value })}
                  >
                    <div className="font-medium text-gray-900">{style.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{style.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <Building className="w-4 h-4 mr-2 text-blue-600" />
                  Accommodation Preference
                </label>
                <select
                  value={formData.accommodation}
                  onChange={(e) => setFormData({ ...formData, accommodation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {accommodationOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <Plane className="w-4 h-4 mr-2 text-blue-600" />
                  Transportation
                </label>
                <select
                  value={formData.transportation}
                  onChange={(e) => setFormData({ ...formData, transportation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {transportationOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <Utensils className="w-4 h-4 mr-2 text-blue-600" />
                  Meal Preference
                </label>
                <select
                  value={formData.mealPreference}
                  onChange={(e) => setFormData({ ...formData, mealPreference: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {mealOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <Activity className="w-4 h-4 mr-2 text-blue-600" />
                  Activity Level
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {activityLevelOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label} - {option.desc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Heart className="w-4 h-4 mr-2 text-blue-600" />
                Travel Interests (Select at least one)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {interestOptions.map((interest) => (
                  <motion.button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      formData.interests.includes(interest)
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {interest.charAt(0).toUpperCase() + interest.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                Special Requests (Optional)
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows={4}
                placeholder="Any special requirements, accessibility needs, dietary restrictions, or specific requests..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto border border-gray-100"
    >
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = completedSteps.includes(index);
            
            return (
              <div key={index} className="flex items-center">
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-lg' :
                  isCompleted ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 transition-all ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <motion.button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            whileHover={{ scale: currentStep === 0 ? 1 : 1.02 }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </motion.button>

          {currentStep < steps.length - 1 ? (
            <motion.button
              type="button"
              onClick={nextStep}
              disabled={!isStepComplete(currentStep)}
              whileHover={{ scale: isStepComplete(currentStep) ? 1.02 : 1 }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                isStepComplete(currentStep)
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              disabled={isLoading || !isStepComplete(currentStep)}
              whileHover={{ scale: (isLoading || !isStepComplete(currentStep)) ? 1 : 1.02 }}
              whileTap={{ scale: (isLoading || !isStepComplete(currentStep)) ? 1 : 0.98 }}
              className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all flex items-center justify-center space-x-2 ${
                isLoading || !isStepComplete(currentStep)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Your Perfect Trip...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate My Itinerary</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
