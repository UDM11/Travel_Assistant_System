import { motion } from 'framer-motion';
import { Shield, FileText, Clock, Users, Globe, AlertTriangle, CheckCircle, ArrowRight, Sparkles, Scale, Lock, Eye } from 'lucide-react';
import { useState } from 'react';

const tableOfContents = [
  { id: 'acceptance', title: 'Acceptance of Terms', icon: CheckCircle },
  { id: 'services', title: 'Description of Services', icon: Globe },
  { id: 'account', title: 'User Accounts', icon: Users },
  { id: 'usage', title: 'Acceptable Use', icon: Shield },
  { id: 'privacy', title: 'Privacy & Data', icon: Lock },
  { id: 'payments', title: 'Payments & Billing', icon: FileText },
  { id: 'liability', title: 'Limitation of Liability', icon: Scale },
  { id: 'termination', title: 'Termination', icon: AlertTriangle },
  { id: 'changes', title: 'Changes to Terms', icon: Clock },
  { id: 'contact', title: 'Contact Information', icon: Eye }
];

const keyHighlights = [
  {
    icon: Shield,
    title: 'Your Rights Protected',
    description: 'We respect your rights and provide clear guidelines for service usage.',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Lock,
    title: 'Data Security',
    description: 'Your personal information is protected with enterprise-grade security.',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Scale,
    title: 'Fair Terms',
    description: 'Our terms are designed to be fair and transparent for all users.',
    color: 'from-purple-500 to-violet-600'
  },
  {
    icon: Globe,
    title: 'Global Service',
    description: 'Terms apply to our worldwide travel planning services.',
    color: 'from-orange-500 to-red-600'
  }
];

const Terms = () => {
  const [activeSection, setActiveSection] = useState('acceptance');

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
              <FileText className="w-5 h-5" />
              <span className="text-sm font-semibold">Legal Documentation</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Terms of
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> Service</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Clear, fair, and transparent terms governing your use of Travel Assistant's AI-powered travel planning services.
            </p>
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Last Updated: January 15, 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Effective Worldwide</span>
              </div>
            </div>
          </motion.div>

          {/* Key Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {keyHighlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${highlight.color} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{highlight.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{highlight.description}</p>
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
                    Table of Contents
                  </h2>
                  <nav className="space-y-2">
                    {tableOfContents.map((item, index) => {
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
                  
                  {/* Section 1: Acceptance of Terms */}
                  <section id="acceptance" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-4">
                        By accessing or using Travel Assistant's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
                      </p>
                      <p className="mb-4">
                        These terms constitute a legally binding agreement between you and Travel Assistant Inc. Your continued use of our services indicates your acceptance of these terms and any future modifications.
                      </p>
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <p className="text-blue-800 font-medium">
                          <strong>Important:</strong> Please read these terms carefully before using our services. By creating an account or using our platform, you acknowledge that you have read, understood, and agree to these terms.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 2: Description of Services */}
                  <section id="services" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">2. Description of Services</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-4">
                        Travel Assistant provides AI-powered travel planning services, including but not limited to:
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Personalized travel itinerary generation</li>
                        <li>Destination recommendations based on preferences</li>
                        <li>Flight and accommodation suggestions</li>
                        <li>Local activity and attraction recommendations</li>
                        <li>Budget planning and cost estimation</li>
                        <li>Weather and travel advisory information</li>
                      </ul>
                      <p className="mb-4">
                        Our services are provided "as is" and are intended for informational purposes. While we strive for accuracy, travel information may change, and users should verify all details independently before making bookings or travel arrangements.
                      </p>
                    </div>
                  </section>

                  {/* Section 3: User Accounts */}
                  <section id="account" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">3. User Accounts</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-4">
                        To access certain features of our service, you may be required to create an account. You are responsible for:
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Providing accurate and complete information</li>
                        <li>Maintaining the security of your account credentials</li>
                        <li>All activities that occur under your account</li>
                        <li>Notifying us immediately of any unauthorized use</li>
                      </ul>
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                        <p className="text-yellow-800 font-medium">
                          <strong>Security Notice:</strong> Never share your account credentials with others. Use strong, unique passwords and enable two-factor authentication when available.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 4: Acceptable Use */}
                  <section id="usage" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">4. Acceptable Use Policy</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-4">You agree not to use our services to:</p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Violate any applicable laws or regulations</li>
                        <li>Infringe on intellectual property rights</li>
                        <li>Transmit harmful or malicious content</li>
                        <li>Attempt to gain unauthorized access to our systems</li>
                        <li>Use automated tools to scrape or harvest data</li>
                        <li>Interfere with the proper functioning of our services</li>
                      </ul>
                      <p className="mb-4">
                        Violation of these policies may result in immediate termination of your account and legal action if necessary.
                      </p>
                    </div>
                  </section>

                  {/* Section 5: Privacy & Data */}
                  <section id="privacy" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">5. Privacy & Data Protection</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-4">
                        Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these terms by reference.
                      </p>
                      <p className="mb-4">Key privacy commitments:</p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>We use enterprise-grade encryption to protect your data</li>
                        <li>Personal information is never sold to third parties</li>
                        <li>You have control over your data and can request deletion</li>
                        <li>We comply with GDPR, CCPA, and other privacy regulations</li>
                      </ul>
                    </div>
                  </section>

                  {/* Section 6: Payments & Billing */}
                  <section id="payments" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">6. Payments & Billing</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-4">
                        For premium services, payment terms include:
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>All fees are charged in USD unless otherwise specified</li>
                        <li>Subscription fees are billed in advance</li>
                        <li>Refunds are provided according to our refund policy</li>
                        <li>Price changes will be communicated 30 days in advance</li>
                      </ul>
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                        <p className="text-green-800 font-medium">
                          <strong>Free Tier:</strong> Basic travel planning features are available at no cost with usage limitations.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 7: Limitation of Liability */}
                  <section id="liability" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <Scale className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">7. Limitation of Liability</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-4">
                        Travel Assistant provides recommendations and suggestions only. We are not responsible for:
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Changes in travel conditions, prices, or availability</li>
                        <li>Cancellations or modifications by third-party providers</li>
                        <li>Travel disruptions due to weather, politics, or other factors</li>
                        <li>Personal injury or property damage during travel</li>
                      </ul>
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <p className="text-red-800 font-medium">
                          <strong>Important:</strong> Always verify travel information independently and consider purchasing travel insurance for protection.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Section 8: Termination */}
                  <section id="termination" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">8. Termination</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-4">
                        Either party may terminate this agreement at any time. Upon termination:
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>Your access to premium features will cease immediately</li>
                        <li>Your data will be retained according to our data retention policy</li>
                        <li>You may request data export before account deletion</li>
                        <li>Refunds will be processed according to our refund policy</li>
                      </ul>
                    </div>
                  </section>

                  {/* Section 9: Changes to Terms */}
                  <section id="changes" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">9. Changes to Terms</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-4">
                        We reserve the right to modify these terms at any time. When we make changes:
                      </p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>We will notify users via email and in-app notifications</li>
                        <li>Changes will be effective 30 days after notification</li>
                        <li>Continued use constitutes acceptance of new terms</li>
                        <li>You may terminate your account if you disagree with changes</li>
                      </ul>
                    </div>
                  </section>

                  {/* Section 10: Contact Information */}
                  <section id="contact" className="scroll-mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">10. Contact Information</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="mb-4">
                        For questions about these Terms of Service, please contact us:
                      </p>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-blue-900 mb-2">Legal Department</h4>
                            <p className="text-blue-700">legal@travelassistant.com</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900 mb-2">Mailing Address</h4>
                            <p className="text-blue-700">
                              Travel Assistant Inc.<br />
                              123 Innovation Drive<br />
                              San Francisco, CA 94105
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 md:px-12 py-8 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-sm text-gray-600">
                      <p><strong>Effective Date:</strong> January 15, 2024</p>
                      <p><strong>Version:</strong> 2.1</p>
                    </div>
                    <motion.a
                      href="/contact"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all"
                    >
                      Questions? Contact Us
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

export default Terms;