import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Zap, Cloud, Plane, Building, Brain } from 'lucide-react';
import { TripData } from '../types';

interface ApiSourcesDisplayProps {
  tripData: TripData;
}

export default function ApiSourcesDisplay({ tripData }: ApiSourcesDisplayProps) {
  const { apiKeysUsed, dataQuality, apiSources, aiGenerated } = tripData;

  if (!apiKeysUsed && !dataQuality) {
    return null;
  }

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <AlertCircle className="w-4 h-4 text-yellow-500" />
    );
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'weather':
        return <Cloud className="w-5 h-5 text-blue-500" />;
      case 'flights':
        return <Plane className="w-5 h-5 text-indigo-500" />;
      case 'hotels':
        return <Building className="w-5 h-5 text-purple-500" />;
      case 'openai':
        return <Brain className="w-5 h-5 text-green-500" />;
      default:
        return <Zap className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mt-6"
    >
      <div className="flex items-center mb-4">
        <Zap className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">
          Powered by Advanced APIs
        </h3>
        {aiGenerated && (
          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            AI Enhanced
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* API Keys Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
            API Connections
          </h4>
          
          {apiKeysUsed && Object.entries(apiKeysUsed).map(([service, isActive]) => (
            <div key={service} className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div className="flex items-center">
                {getServiceIcon(service)}
                <span className="ml-2 text-sm font-medium capitalize">
                  {service === 'openai' ? 'OpenAI GPT' : service}
                </span>
              </div>
              <div className="flex items-center">
                {getStatusIcon(isActive)}
                <span className="ml-1 text-xs text-gray-600">
                  {isActive ? 'Active' : 'Demo'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Data Quality */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
            Data Quality
          </h4>
          
          {dataQuality && Object.entries(dataQuality).map(([service, quality]) => (
            <div key={service} className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div className="flex items-center">
                {getServiceIcon(service)}
                <span className="ml-2 text-sm font-medium capitalize">
                  {service}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                quality.includes('Real') || quality.includes('AI') || quality.includes('Live')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {quality}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* API Sources Details */}
      {apiSources && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide mb-2">
            Data Sources
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(apiSources).map(([key, source]) => (
              <span
                key={key}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {typeof source === 'string' ? source : key}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        Your trip plan is powered by multiple APIs for the most accurate and up-to-date information
      </div>
    </motion.div>
  );
}