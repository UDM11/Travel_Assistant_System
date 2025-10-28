import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import { Sparkles, Zap, Heart, Globe, Shield, Clock, Users, Star, MapPin, Camera, Plane, Calendar, TrendingUp, Award, CheckCircle, ArrowRight, Play, MessageCircle, BarChart3, Briefcase, Coffee, Headphones, Smartphone, Wifi, CreditCard, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Planning',
    description: 'Advanced machine learning creates perfect itineraries in under 30 seconds with 99.7% accuracy.',
    color: 'from-yellow-400 to-orange-500',
    metric: '30s',
    metricLabel: 'Planning Time'
  },
  {
    icon: Sparkles,
    title: 'Smart Recommendations',
    description: 'Personalized suggestions based on 50M+ traveler data points and real-time preferences.',
    color: 'from-purple-400 to-pink-500',
    metric: '50M+',
    metricLabel: 'Data Points'
  },
  {
    icon: Heart,
    title: 'Curated Experiences',
    description: 'Hand-picked local experiences and hidden gems verified by travel experts.',
    color: 'from-red-400 to-pink-500',
    metric: '10K+',
    metricLabel: 'Experiences'
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Comprehensive coverage of 250+ destinations with real-time insights and local expertise.',
    color: 'from-blue-400 to-cyan-500',
    metric: '250+',
    metricLabel: 'Destinations'
  },
  {
    icon: Shield,
    title: 'Travel Protection',
    description: 'Integrated travel insurance and 24/7 emergency assistance with global coverage.',
    color: 'from-green-400 to-emerald-500',
    metric: '24/7',
    metricLabel: 'Support'
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Live flight tracking, weather alerts, and destination updates with instant notifications.',
    color: 'from-indigo-400 to-purple-500',
    metric: 'Live',
    metricLabel: 'Updates'
  }
];

const stats = [
  { number: '2.5M+', label: 'Happy Travelers', icon: Users, description: 'Satisfied customers worldwide' },
  { number: '75K+', label: 'Trips Planned', icon: MapPin, description: 'AI-generated itineraries' },
  { number: '4.9/5', label: 'User Rating', icon: Star, description: 'Average customer satisfaction' },
  { number: '250+', label: 'Destinations', icon: Globe, description: 'Countries and cities covered' }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Digital Nomad',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    content: 'This AI assistant planned my 3-week European adventure perfectly. Every recommendation was spot-on!',
    rating: 5,
    location: 'San Francisco, CA'
  },
  {
    name: 'Michael Chen',
    role: 'Business Executive',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    content: 'Saved me hours of research. The itinerary was detailed, practical, and included amazing local spots.',
    rating: 5,
    location: 'New York, NY'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Travel Blogger',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    content: 'As a travel expert, I was impressed by the quality and authenticity of the recommendations.',
    rating: 5,
    location: 'Barcelona, Spain'
  }
];

const destinations = [
  {
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    trips: '12,450',
    rating: 4.9,
    highlights: ['Cherry Blossoms', 'Sushi Tours', 'Tech Districts']
  },
  {
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
    trips: '18,230',
    rating: 4.8,
    highlights: ['Art Museums', 'Café Culture', 'Architecture']
  },
  {
    name: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
    trips: '9,876',
    rating: 4.9,
    highlights: ['Beach Resorts', 'Temples', 'Wellness']
  },
  {
    name: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
    trips: '15,670',
    rating: 4.7,
    highlights: ['Broadway', 'Museums', 'Food Scene']
  }
];

const howItWorks = [
  {
    step: '01',
    title: 'Tell Us Your Dreams',
    description: 'Share your destination, dates, budget, and travel preferences with our AI assistant.',
    icon: MessageCircle
  },
  {
    step: '02',
    title: 'AI Creates Magic',
    description: 'Our advanced algorithms analyze millions of data points to craft your perfect itinerary.',
    icon: Sparkles
  },
  {
    step: '03',
    title: 'Customize & Book',
    description: 'Review, modify, and book your personalized travel plan with integrated booking partners.',
    icon: CheckCircle
  }
];

const companyLogos = [
  { name: 'TechCrunch', logo: 'https://via.placeholder.com/120x40/000000/FFFFFF?text=TechCrunch' },
  { name: 'Forbes', logo: 'https://via.placeholder.com/120x40/000000/FFFFFF?text=Forbes' },
  { name: 'CNN Travel', logo: 'https://via.placeholder.com/120x40/000000/FFFFFF?text=CNN+Travel' },
  { name: 'Wired', logo: 'https://via.placeholder.com/120x40/000000/FFFFFF?text=Wired' },
  { name: 'BBC', logo: 'https://via.placeholder.com/120x40/000000/FFFFFF?text=BBC' }
];

const enterpriseFeatures = [
  { icon: Briefcase, title: 'Enterprise Solutions', description: 'Custom travel management for businesses' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Detailed insights and reporting tools' },
  { icon: Headphones, title: 'Priority Support', description: 'Dedicated account management' },
  { icon: Lock, title: 'Enterprise Security', description: 'SOC 2 compliant with advanced encryption' }
];

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [currentStats, setCurrentStats] = useState(stats.map(stat => ({ ...stat, animatedNumber: 0 })));

  useEffect(() => {
    const animateStats = () => {
      stats.forEach((stat, index) => {
        const target = parseInt(stat.number.replace(/[^0-9.]/g, ''));
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setCurrentStats(prev => {
            const newStats = [...prev];
            newStats[index] = { ...newStats[index], animatedNumber: Math.floor(current) };
            return newStats;
          });
        }, 30);
      });
    };
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateStats();
        observer.disconnect();
      }
    });
    
    const statsElement = document.getElementById('stats-section');
    if (statsElement) observer.observe(statsElement);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Company Logos */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm mb-6">Trusted by leading companies and featured in</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {companyLogos.map((company, index) => (
              <motion.img
                key={company.name}
                src={company.logo}
                alt={company.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.6, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-8 grayscale hover:grayscale-0 transition-all"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-16 lg:py-20 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted by Millions Worldwide</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">Join the revolution in AI-powered travel planning</p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {currentStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center text-white bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <Icon className="w-8 h-8 lg:w-10 lg:h-10 mx-auto mb-4 text-blue-200" />
                  <div className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-2">
                    {stat.number.includes('.') ? stat.number : `${stat.animatedNumber}${stat.number.replace(/[0-9]/g, '')}`}
                  </div>
                  <div className="text-blue-100 text-sm lg:text-base font-semibold mb-1">{stat.label}</div>
                  <div className="text-blue-200 text-xs">{stat.description}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Next-Generation Travel Technology
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of travel planning with cutting-edge artificial intelligence, machine learning, and real-time data processing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
                  className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-r ${feature.color} w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{feature.metric}</div>
                      <div className="text-xs text-gray-500">{feature.metricLabel}</div>
                    </div>
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
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
              Three simple steps to your perfect travel experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="relative text-center"
                >
                  <div className="relative">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  {index < howItWorks.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-10 -right-4 w-8 h-8 text-gray-300" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the world's most loved destinations, curated by our AI and travel experts
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{destination.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{destination.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{destination.trips} trips planned</p>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight) => (
                      <span key={highlight} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Travelers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from real travelers who've experienced the magic of AI-powered planning
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Solutions</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Scalable travel management for businesses of all sizes</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enterpriseFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors"
                >
                  <Icon className="w-10 h-10 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to Transform Your Travel?
            </h2>
            <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join over 2.5 million travelers who've discovered the future of trip planning. Start your AI-powered journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.a
                href="/plan"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all group"
              >
                <Plane className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Start Planning Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all group backdrop-blur-sm"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </motion.button>
            </div>
            <div className="flex items-center justify-center space-x-6 text-blue-100 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
