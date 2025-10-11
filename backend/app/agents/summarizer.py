from typing import Dict, Any, List
from datetime import datetime

from app.services.llm_client import LLMClient


class SummarizerAgent:
    """
    Agent responsible for formatting and summarizing the final trip plan
    """
    
    def __init__(self):
        self.llm_client = LLMClient()
    
    async def summarize_trip(
        self,
        destination: str,
        itinerary: Dict[str, Any],
        budget: float,
        preferences: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Create a comprehensive trip summary
        """
        try:
            # Generate summary using LLM
            summary = await self._generate_trip_summary(
                destination=destination,
                itinerary=itinerary,
                budget=budget,
                preferences=preferences
            )
            
            # Generate recommendations
            recommendations = await self._generate_recommendations(
                destination=destination,
                itinerary=itinerary,
                preferences=preferences
            )
            
            # Create packing list
            packing_list = await self._generate_packing_list(
                destination=destination,
                itinerary=itinerary,
                preferences=preferences
            )
            
            return {
                "summary": summary,
                "itinerary": itinerary["itinerary"],
                "cost_breakdown": itinerary["cost_breakdown"],
                "recommendations": recommendations,
                "packing_list": packing_list,
                "trip_overview": {
                    "destination": destination,
                    "duration": itinerary["duration_days"],
                    "total_cost": itinerary["cost_breakdown"]["total_cost"],
                    "budget_status": itinerary["budget_compliance"]["status"],
                    "created_at": datetime.utcnow().isoformat()
                }
            }
            
        except Exception as e:
            print(f"❌ Trip summarization failed: {str(e)}")
            raise Exception(f"Trip summarization failed: {str(e)}")
    
    async def _generate_trip_summary(
        self,
        destination: str,
        itinerary: Dict[str, Any],
        budget: float,
        preferences: Dict[str, Any]
    ) -> str:
        """Generate a comprehensive trip summary"""
        
        prompt = f"""
        Create a comprehensive trip summary for a {itinerary['duration_days']}-day trip to {destination}.
        
        Trip Details:
        - Budget: ${budget:,.2f}
        - Actual Cost: ${itinerary['cost_breakdown']['total_cost']:,.2f}
        - Travelers: {preferences.get('travelers', 1)}
        - Interests: {preferences.get('interests', [])}
        
        Itinerary Highlights:
        {self._format_itinerary_for_summary(itinerary['itinerary'])}
        
        Cost Breakdown:
        {itinerary['cost_breakdown']}
        
        Create a compelling summary that includes:
        1. Trip overview and highlights
        2. Key experiences and activities
        3. Budget analysis and value proposition
        4. Best times and tips for each major activity
        5. Cultural insights and local experiences
        6. Transportation and logistics overview
        
        Make it engaging and informative, suitable for sharing with friends or family.
        """
        
        response = await self.llm_client.generate_response(prompt)
        return response
    
    async def _generate_recommendations(
        self,
        destination: str,
        itinerary: Dict[str, Any],
        preferences: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Generate personalized recommendations"""
        
        prompt = f"""
        Based on this {destination} itinerary and user preferences {preferences}, 
        provide 5-7 personalized recommendations including:
        
        1. Alternative activities if weather is bad
        2. Budget-friendly alternatives for expensive activities
        3. Hidden gems and local secrets
        4. Photography spots and Instagram-worthy locations
        5. Local food experiences not to miss
        6. Shopping recommendations
        7. Cultural etiquette tips
        
        Format as a JSON array with title, description, and category for each recommendation.
        """
        
        response = await self.llm_client.generate_response(prompt)
        
        try:
            import json
            return json.loads(response)
        except json.JSONDecodeError:
            # Fallback recommendations
            return [
                {
                    "title": "Weather Backup Plan",
                    "description": "Visit museums and indoor attractions if weather is poor",
                    "category": "weather"
                },
                {
                    "title": "Local Food Tour",
                    "description": "Try street food and local markets for authentic experiences",
                    "category": "food"
                },
                {
                    "title": "Photography Tips",
                    "description": "Best lighting is during golden hour for city photography",
                    "category": "photography"
                }
            ]
    
    async def _generate_packing_list(
        self,
        destination: str,
        itinerary: Dict[str, Any],
        preferences: Dict[str, Any]
    ) -> Dict[str, List[str]]:
        """Generate a personalized packing list"""
        
        prompt = f"""
        Create a comprehensive packing list for a {itinerary['duration_days']}-day trip to {destination}.
        
        Consider:
        - Weather conditions (if available)
        - Activities planned: {self._extract_activities(itinerary['itinerary'])}
        - User preferences: {preferences}
        - Duration: {itinerary['duration_days']} days
        
        Organize into categories:
        - Clothing
        - Electronics
        - Toiletries
        - Documents
        - Miscellaneous
        
        Format as JSON with category arrays.
        """
        
        response = await self.llm_client.generate_response(prompt)
        
        try:
            import json
            return json.loads(response)
        except json.JSONDecodeError:
            # Fallback packing list
            return {
                "clothing": [
                    "Comfortable walking shoes",
                    "Weather-appropriate clothing",
                    "Formal outfit for dinner",
                    "Swimwear (if applicable)"
                ],
                "electronics": [
                    "Phone and charger",
                    "Camera",
                    "Power bank",
                    "Universal adapter"
                ],
                "toiletries": [
                    "Personal hygiene items",
                    "Sunscreen",
                    "First aid kit"
                ],
                "documents": [
                    "Passport/ID",
                    "Travel insurance",
                    "Booking confirmations",
                    "Emergency contacts"
                ],
                "miscellaneous": [
                    "Day bag",
                    "Water bottle",
                    "Snacks",
                    "Cash and cards"
                ]
            }
    
    def _format_itinerary_for_summary(self, itinerary: List[Dict[str, Any]]) -> str:
        """Format itinerary for summary generation"""
        formatted = ""
        for day in itinerary:
            formatted += f"Day {day['day']}:\n"
            formatted += f"  Morning: {', '.join(day['morning']['activities'])}\n"
            formatted += f"  Afternoon: {', '.join(day['afternoon']['activities'])}\n"
            formatted += f"  Evening: {', '.join(day['evening']['activities'])}\n\n"
        return formatted
    
    def _extract_activities(self, itinerary: List[Dict[str, Any]]) -> List[str]:
        """Extract all activities from itinerary"""
        activities = []
        for day in itinerary:
            activities.extend(day['morning']['activities'])
            activities.extend(day['afternoon']['activities'])
            activities.extend(day['evening']['activities'])
        return list(set(activities))  # Remove duplicates
