const travelPrompt = (userInput: string, userPreferences: any) => `
You are a professional travel assistant. Your goal is to plan an ideal trip based on the user's input and preferences. Follow these rules:

1. **Understand the user request fully.**
   - User request: "${userInput}"
   - User preferences: ${JSON.stringify(userPreferences)}

2. **Research**
   - Suggest best destinations, activities, and landmarks
   - Include flight, hotel, and weather information where relevant

3. **Plan**
   - Create a day-by-day itinerary
   - Ensure logical flow: proximity, time, and cost efficiency
   - Include optional tips (local transport, food, events)

4. **Summarize**
   - Provide a clear, human-friendly output
   - Highlight total cost, duration, and must-see attractions
   - Use bullets, tables, or HTML-ready format for frontend rendering

5. **Personalization**
   - Respect user budget, travel style, and preferences
   - Suggest alternatives if the original request exceeds budget or is impractical

6. **Format**
   - Return JSON with keys: itinerary, flights, hotels, totalCost, tips, summary
   - Example:
   {
     "itinerary": [{"day":1, "activities":["Eiffel Tower", "Louvre"]}],
     "flights": [{"from":"NYC","to":"Paris","price":1200}],
     "hotels": [{"name":"Hotel Paris","price":500}],
     "totalCost": 1700,
     "tips": ["Use metro pass","Book tickets in advance"],
     "summary": "Your 5-day Paris trip includes the Eiffel Tower and Louvre..."
   }

Generate the output strictly in the JSON format above so the frontend can render it properly.
`;

// Mock AI response for demonstration
const generateMockItinerary = (userInput: string, userPreferences: any) => {
  const destination = userInput.match(/visit\s+([^,]+)/i)?.[1] || 'Paris';
  const days = Math.ceil(Math.random() * 5) + 3; // 3-8 days
  
  const baseCost = userPreferences.budget === 'budget' ? 100 : 
                   userPreferences.budget === 'medium' ? 200 : 400;
  
  const itinerary = Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    activities: [
      {
        name: `Explore ${destination} Landmarks`,
        time: '9:00 AM',
        location: `Historic Center of ${destination}`,
        type: 'sightseeing',
        description: `Visit the most iconic attractions and learn about local history.`
      },
      {
        name: 'Local Cuisine Experience',
        time: '12:30 PM',
        location: 'Traditional Restaurant',
        type: 'food',
        description: 'Enjoy authentic local dishes and regional specialties.'
      },
      {
        name: 'Cultural Activity',
        time: '3:00 PM',
        location: 'City Center',
        type: 'culture',
        description: 'Immerse yourself in local culture and traditions.'
      }
    ],
    meals: [
      'Breakfast at local café',
      'Traditional lunch at recommended restaurant',
      'Dinner at rooftop restaurant with city views'
    ],
    transportation: 'Walking + Public Transport'
  }));

  return {
    itinerary,
    flights: [
      {
        from: 'Your City',
        to: destination,
        price: Math.floor(baseCost * 4 + Math.random() * 500)
      }
    ],
    hotels: [
      {
        name: `${destination} Central Hotel`,
        price: Math.floor(baseCost * 0.8 + Math.random() * 100)
      }
    ],
    totalCost: Math.floor(baseCost * days + Math.random() * 1000),
    tips: [
      'Book accommodations in advance for better rates',
      'Use local public transportation to save money',
      'Try local street food for authentic experiences',
      'Learn basic phrases in the local language',
      'Keep copies of important documents',
      'Research local customs and etiquette'
    ],
    summary: `Your ${days}-day trip to ${destination} combines must-see attractions with authentic local experiences. We've optimized your itinerary for ${userPreferences.travelStyle} travel style and ${userPreferences.budget} budget range, ensuring you get the most out of your adventure while staying within your preferences.`
  };
};

export const generateItinerary = async (userInput: string, userPreferences: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
  
  try {
    // In a real implementation, this would call your AI service
    // const response = await fetch('/api/generate-itinerary', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userInput, userPreferences })
    // });
    // return await response.json();
    
    // For demo purposes, return mock data
    return generateMockItinerary(userInput, userPreferences);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error('Failed to generate itinerary. Please try again.');
  }
};

export const submitFeedback = async (feedbackData: any) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // In a real implementation:
    // const response = await fetch('/api/feedback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(feedbackData)
    // });
    // return await response.json();
    
    console.log('Feedback submitted:', feedbackData);
    return { success: true };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error('Failed to submit feedback. Please try again.');
  }
};