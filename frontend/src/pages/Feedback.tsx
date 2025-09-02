import React, { useState } from 'react';
import { Star, MessageCircle, Send, ThumbsUp } from 'lucide-react';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !feedback.trim()) {
      return;
    }
    
    // Here you would typically send the feedback to your backend
    console.log('Feedback submitted:', { rating, feedback });
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setFeedback('');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-lg p-12 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ThumbsUp className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-xl text-gray-600 mb-6">
            Your feedback helps us improve TravelAI for everyone.
          </p>
          <div className="animate-pulse text-gray-500">
            Redirecting you back to the feedback form...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <MessageCircle className="h-16 w-16 text-blue-600 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Share Your Experience
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Help us improve TravelAI by sharing your feedback about your trip planning experience.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              How would you rate your experience?
            </h3>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-2 transition-all duration-200 transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    } transition-colors duration-200`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-2 text-gray-600">
                {rating === 5 && "Excellent! We're thrilled you had a great experience."}
                {rating === 4 && "Great! Thanks for the positive feedback."}
                {rating === 3 && "Good! We appreciate your honest feedback."}
                {rating === 2 && "We'd love to hear how we can improve."}
                {rating === 1 && "We're sorry to hear that. Please let us know what went wrong."}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tell us about your experience
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What did you like? What could we improve? Any suggestions?"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={rating === 0 || !feedback.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            <Send className="h-5 w-5 mr-2" />
            Submit Feedback
          </button>
        </form>
      </div>

      {/* Additional Feedback Options */}
      <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2">Have a Feature Request?</h3>
          <p className="text-gray-600 text-sm">
            We're always looking to improve. Let us know what features you'd like to see.
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl border border-green-100">
          <h3 className="font-semibold text-gray-900 mb-2">Found a Bug?</h3>
          <p className="text-gray-600 text-sm">
            Help us fix issues by reporting any problems you encountered.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;