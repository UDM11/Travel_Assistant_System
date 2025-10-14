const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>By using Travel Assistant, you agree to these terms of service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
            <p>Travel Assistant provides AI-powered travel planning recommendations and itinerary suggestions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
            <p>Users must provide accurate information and use the service responsibly.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Limitations</h2>
            <p>Travel recommendations are suggestions only. Users should verify all travel information independently.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Privacy</h2>
            <p>We collect and use personal information as described in our Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Contact</h2>
            <p>For questions about these terms, contact us through our Contact page.</p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;