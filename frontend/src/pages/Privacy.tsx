import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Users, Globe, Settings, Download, Trash2, ArrowRight, Sparkles, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useState } from 'react';

const tableOfContents = [
  { id: 'overview', title: 'Privacy Overview', icon: Shield },
  { id: 'collection', title: 'Information We Collect', icon: Database },
  { id: 'usage', title: 'How We Use Your Data', icon: Settings },
  { id: 'sharing', title: 'Information Sharing', icon: Users },
  { id: 'security', title: 'Data Security', icon: Lock },
  { id: 'cookies', title: 'Cookies & Tracking', icon: Eye },
  { id: 'rights', title: 'Your Privacy Rights', icon: CheckCircle },
  { id: 'retention', title: 'Data Retention', icon: Database },
  { id: 'international', title: 'International Transfers', icon: Globe },
  { id: 'contact', title: 'Contact & Updates', icon: ArrowRight }
];

const privacyPrinciples = [
  {
    icon: Shield,
    title: 'Privacy by Design',
    description: 'Privacy protection is built into every aspect of our service from the ground up.',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Lock,
    title: 'Data Minimization',
    description: 'We only collect data that is necessary to provide and improve our services.',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Eye,
    title: 'Transparency',
    description: 'Clear information about what data we collect and how we use it.',
    color: 'from-purple-500 to-violet-600'
  },
  {
    icon: Users,
    title: 'User Control',
    description: 'You have full control over your personal data and privacy settings.',
    color: 'from-orange-500 to-red-600'
  }
];

const dataTypes = [
  {
    category: 'Account Information',
    items: ['Name and email address', 'Profile preferences', 'Account settings'],
    purpose: 'Account management and personalization',
    retention: '2 years after account deletion'
  },
  {
    category: 'Travel Data',
    items: ['Destination preferences', 'Travel dates', 'Budget information', 'Trip itineraries'],
    purpose: 'Personalized travel recommendations',
    retention: '3 years for service improvement'
  },
  {
    category: 'Usage Analytics',
    items: ['Page views', 'Feature usage', 'Performance metrics'],
    purpose: 'Service optimization and improvement',
    retention: '18 months in aggregated form'
  },
  {
    category: 'Technical Data',
    items: ['IP address', 'Browser information', 'Device identifiers'],
    purpose: 'Security and technical support',
    retention: '12 months for security purposes'
  }
];

const userRights = [
  {
    right: 'Access',
    description: 'Request a copy of all personal data we hold about you',
    action: 'Download My Data',
    icon: Download
  },
  {
    right: 'Rectification',
    description: 'Correct any inaccurate or incomplete personal information',
    action: 'Update Profile',
    icon: Settings
  },
  {
    right: 'Erasure',
    description: 'Request deletion of your personal data (right to be forgotten)',
    action: 'Delete Account',
    icon: Trash2
  },
  {
    right: 'Portability',
    description: 'Export your data in a machine-readable format',
    action: 'Export Data',
    icon: Download
  }
];

const Privacy = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-3 rounded-full mb-8 border border-blue-200"
            >
              <Shield className="w-5 h-5" />
              <span className="text-sm font-semibold">Your Privacy Matters</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Privacy
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> Policy</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're committed to protecting your privacy and being transparent about how we collect, use, and safeguard your personal information.
            </p>
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>CCPA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Last Updated: January 15, 2024</span>
              </div>
            </div>
          </motion.div>

          {/* Privacy Principles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {privacyPrinciples.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${principle.color} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{principle.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{principle.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Table of Contents */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-8">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                    Quick Navigation
                  </h2>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          whileHover={{ x: 4 }}
                          className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                            activeSection === item.id
                              ? 'bg-blue-100 text-blue-700 shadow-sm'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{item.title}</span>
                        </motion.button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="p-8 md:p-12 space-y-12">
                  
                  {/* Section 1: Privacy Overview */}
                  <section id="overview" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">Privacy Overview</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-4">
                        At Travel Assistant, your privacy is fundamental to our mission. This Privacy Policy explains how we collect, use, protect, and share your personal information when you use our AI-powered travel planning services.
                      </p>
                      <p className="mb-4">
                        We are committed to transparency and giving you control over your personal data. This policy complies with major privacy regulations including GDPR, CCPA, and other applicable data protection laws.
                      </p>
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <p className="text-blue-800 font-medium">
                          <strong>Key Commitment:</strong> We never sell your personal data to third parties and only use it to provide and improve our travel planning services.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 2: Information We Collect */}
                  <section id="collection" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Database className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">Information We Collect</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-6">
                        We collect different types of information to provide personalized travel recommendations and improve our services:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {dataTypes.map((type, index) => (
                          <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                            <h4 className="text-lg font-bold text-gray-900 mb-3">{type.category}</h4>
                            <ul className="list-disc pl-5 mb-4 space-y-1">
                              {type.items.map((item, i) => (
                                <li key={i} className="text-gray-700 text-sm">{item}</li>
                              ))}
                            </ul>
                            <div className="text-xs text-gray-600">
                              <p><strong>Purpose:</strong> {type.purpose}</p>
                              <p><strong>Retention:</strong> {type.retention}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Section 3: How We Use Your Data */}
                  <section id="usage" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">How We Use Your Data</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-4">We use your personal information for the following purposes:</p>
                      <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li><strong>Personalized Recommendations:</strong> Create tailored travel itineraries based on your preferences</li>
                        <li><strong>Service Delivery:</strong> Provide travel planning tools and customer support</li>
                        <li><strong>Communication:</strong> Send important updates about your trips and our services</li>
                        <li><strong>Improvement:</strong> Analyze usage patterns to enhance our AI algorithms</li>
                        <li><strong>Security:</strong> Protect against fraud and ensure platform security</li>
                        <li><strong>Legal Compliance:</strong> Meet regulatory requirements and legal obligations</li>
                      </ul>
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                        <p className="text-green-800 font-medium">
                          <strong>Legal Basis:</strong> We process your data based on consent, contract performance, legitimate interests, and legal obligations as defined by GDPR.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 4: Information Sharing */}
                  <section id="sharing" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">Information Sharing</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-4">We may share your information in limited circumstances:</p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li><strong>Service Providers:</strong> Trusted partners who help deliver our services (cloud hosting, analytics)</li>
                        <li><strong>Travel Partners:</strong> Airlines, hotels, and booking platforms (only with your consent)</li>
                        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                        <li><strong>Business Transfers:</strong> In case of merger or acquisition (with notice)</li>
                      </ul>
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <p className="text-red-800 font-medium">
                          <strong>We Never:</strong> Sell your personal data, share it for marketing without consent, or provide it to data brokers.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 5: Data Security */}
                  <section id="security" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">Data Security</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-4">We implement comprehensive security measures to protect your data:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-xl">
                          <h4 className="font-bold text-blue-900 mb-2">Technical Safeguards</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• AES-256 encryption at rest</li>
                            <li>• TLS 1.3 encryption in transit</li>
                            <li>• Multi-factor authentication</li>
                            <li>• Regular security audits</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl">
                          <h4 className="font-bold text-green-900 mb-2">Operational Security</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• Access controls and monitoring</li>
                            <li>• Employee security training</li>
                            <li>• Incident response procedures</li>
                            <li>• Regular backup and recovery</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section 6: Your Privacy Rights */}
                  <section id="rights" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">Your Privacy Rights</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-6">You have comprehensive rights regarding your personal data:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userRights.map((right, index) => {
                          const Icon = right.icon;
                          return (
                            <div key={index} className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-6 border border-gray-200">
                              <div className="flex items-center space-x-3 mb-3">
                                <Icon className="w-6 h-6 text-green-600" />
                                <h4 className="text-lg font-bold text-gray-900">{right.right}</h4>
                              </div>
                              <p className="text-gray-700 text-sm mb-4">{right.description}</p>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="w-full bg-green-100 hover:bg-green-200 text-green-700 py-2 px-4 rounded-xl font-medium transition-all text-sm"
                              >
                                {right.action}
                              </motion.button>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                        <p className="text-yellow-800 font-medium">
                          <strong>Exercise Your Rights:</strong> Contact our privacy team at privacy@travelassistant.com to exercise any of these rights. We'll respond within 30 days.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Additional sections would continue here... */}
                  
                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 md:px-12 py-8 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-sm text-gray-600">
                      <p><strong>Effective Date:</strong> January 15, 2024</p>
                      <p><strong>Privacy Officer:</strong> privacy@travelassistant.com</p>
                    </div>
                    <motion.a
                      href="/contact"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all"
                    >
                      Privacy Questions?
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;