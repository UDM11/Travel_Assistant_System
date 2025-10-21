import { Plane, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Heart, Globe, Shield, FileText, MessageCircle, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <Plane className="relative w-10 h-10 text-blue-400 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 p-2 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Travel Assistant
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">AI-Powered Travel Planning</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed max-w-md">
                Experience the future of travel planning with our AI-powered assistant. Create personalized itineraries, discover hidden gems, and make every journey unforgettable.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors group">
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">support@travelassistant.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors group">
                  <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors group">
                  <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/" onClick={handleLinkClick} className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-2 group"><Globe className="w-4 h-4 group-hover:scale-110 transition-transform" /><span>Home</span></Link></li>
                <li><Link to="/plan" onClick={handleLinkClick} className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-2 group"><MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" /><span>Plan Trip</span></Link></li>
                <li><Link to="/recent" onClick={handleLinkClick} className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-2 group"><MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /><span>Recent Trips</span></Link></li>
                <li><Link to="/about" onClick={handleLinkClick} className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-2 group"><Heart className="w-4 h-4 group-hover:scale-110 transition-transform" /><span>About</span></Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="/privacy" onClick={handleLinkClick} className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-2 group"><Shield className="w-4 h-4 group-hover:scale-110 transition-transform" /><span>Privacy Policy</span></Link></li>
                <li><Link to="/terms" onClick={handleLinkClick} className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-2 group"><FileText className="w-4 h-4 group-hover:scale-110 transition-transform" /><span>Terms of Service</span></Link></li>
                <li><Link to="/contact" onClick={handleLinkClick} className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-2 group"><MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /><span>Contact</span></Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="flex items-center space-x-2 text-gray-400">
                <span className="text-sm">© {currentYear} Travel Assistant. Made with</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="text-sm">by AI Innovation Team</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400 mr-2">Follow us:</span>
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.1 }}
                      className="group relative p-2 rounded-lg bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                    >
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </motion.a>
                  );
                })}
              </div>

              {/* Back to Top */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="group p-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
              >
                <ArrowUp className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
