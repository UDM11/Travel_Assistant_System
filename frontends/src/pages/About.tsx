import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Users, Code, Rocket } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Intelligence',
    description:
      'Our advanced AI algorithms analyze millions of travel data points to create personalized itineraries tailored to your preferences.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Planning',
    description:
      'Get a complete travel plan in seconds. No more hours of research and manual planning.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'Your data is stored securely and never shared. We prioritize your privacy above all.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description:
      'Learn from millions of travelers who have explored destinations worldwide.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Travel Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing travel planning with the power of Agentic AI
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Travel Assistant is an intelligent travel planning platform that leverages cutting-edge
            AI technology to make trip planning effortless and enjoyable. We believe that everyone
            deserves access to personalized travel experiences without the stress of manual
            research and planning.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our AI-powered system analyzes your preferences, budget, and interests to generate
            customized itineraries that perfectly match your travel style. Whether you're seeking
            adventure, relaxation, cultural experiences, or culinary delights, we've got you
            covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all"
            >
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <div className="flex items-center mb-6">
            <Rocket className="w-8 h-8 mr-3" />
            <h2 className="text-3xl font-bold">Upcoming Backend Integration</h2>
          </div>
          <p className="text-lg text-blue-100 leading-relaxed mb-6">
            We're currently in the frontend-only phase, using mock data to demonstrate the user
            experience. Our development roadmap includes:
          </p>
          <ul className="space-y-3 text-blue-100">
            <li className="flex items-start">
              <Code className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
              <span>
                Full backend API integration with FastAPI for real-time data processing
              </span>
            </li>
            <li className="flex items-start">
              <Code className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
              <span>
                Live weather forecasts, flight searches, and accommodation recommendations
              </span>
            </li>
            <li className="flex items-start">
              <Code className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
              <span>User authentication and personalized trip history synchronization</span>
            </li>
            <li className="flex items-start">
              <Code className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
              <span>
                Advanced AI models for even more accurate and personalized recommendations
              </span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center mt-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to start your journey?
          </h3>
          <motion.a
            href="/plan"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:bg-blue-700 transition-all"
          >
            Plan Your Next Adventure
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
