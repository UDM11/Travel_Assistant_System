from typing import Dict, Any, List
import asyncio
from datetime import datetime, timedelta

from app.services.llm_client import LLMClient
from app.services.cost_calc import CostCalculator


class PlannerAgent:
    """
    Agent responsible for creating structured itineraries
    """
    
    def __init__(self):
        self.llm_client = LLMClient()
        self.cost_calculator = CostCalculator()
    
    async def create_itinerary(
        self,
        destination: str,
        start_date: str,
        end_date: str,
        budget: float,
        travelers: int,
        research_data: Dict[str, Any],
        preferences: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Create a detailed day-by-day itinerary
        """
        try:
            # Calculate trip duration
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
            end_dt = datetime.strptime(end_date, "%Y-%m-%d")
            duration = (end_dt - start_dt).days
            
            # Generate itinerary using LLM
            itinerary = await self._generate_itinerary_with_llm(
                destination=destination,
                duration=duration,
                budget=budget,
                travelers=travelers,
                research_data=research_data,
                preferences=preferences
            )
            
            # Calculate costs for the itinerary
            cost_breakdown = await self.cost_calculator.calculate_trip_costs(
                itinerary=itinerary,
                travelers=travelers,
                research_data=research_data
            )
            
            return {
                "destination": destination,
                "duration_days": duration,
                "itinerary": itinerary,
                "cost_breakdown": cost_breakdown,
                "budget_compliance": self._check_budget_compliance(budget, cost_breakdown["total_cost"]),
                "created_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            print(f"❌ Itinerary planning failed: {str(e)}")
            raise Exception(f"Itinerary creation failed: {str(e)}")
    
    async def _generate_itinerary_with_llm(
        self,
        destination: str,
        duration: int,
        budget: float,
        travelers: int,
        research_data: Dict[str, Any],
        preferences: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Generate itinerary using LLM"""
        
        prompt = f"""
        Create a detailed {duration}-day itinerary for {destination} for {travelers} traveler(s).
        
        Budget: ${budget:,.2f}
        Preferences: {preferences}
        
        Available data:
        - Weather: {research_data.get('weather', 'Not available')}
        - Attractions: {research_data.get('attractions', 'Not available')}
        - Destination info: {research_data.get('destination_info', 'Not available')}
        
        For each day, provide:
        1. Morning activities (9 AM - 12 PM)
        2. Afternoon activities (12 PM - 6 PM)  
        3. Evening activities (6 PM - 10 PM)
        4. Meal suggestions
        5. Transportation between locations
        6. Estimated costs per activity
        
        Format as a structured JSON array with this schema:
        [
            {{
                "day": 1,
                "date": "YYYY-MM-DD",
                "morning": {{
                    "activities": ["activity1", "activity2"],
                    "location": "area/neighborhood",
                    "estimated_cost": 50,
                    "duration_hours": 3
                }},
                "afternoon": {{
                    "activities": ["activity1", "activity2"],
                    "location": "area/neighborhood", 
                    "estimated_cost": 75,
                    "duration_hours": 4
                }},
                "evening": {{
                    "activities": ["activity1", "activity2"],
                    "location": "area/neighborhood",
                    "estimated_cost": 100,
                    "duration_hours": 4
                }},
                "meals": {{
                    "breakfast": "restaurant suggestion",
                    "lunch": "restaurant suggestion", 
                    "dinner": "restaurant suggestion",
                    "meal_cost": 80
                }},
                "transportation": {{
                    "method": "metro/taxi/walking",
                    "cost": 20,
                    "notes": "transportation notes"
                }},
                "daily_total": 325
            }}
        ]
        
        Ensure the total cost stays within budget and activities match user preferences.
        """
        
        response = await self.llm_client.generate_response(prompt)
        
        # Parse the JSON response
        try:
            import json
            itinerary = json.loads(response)
            return itinerary
        except json.JSONDecodeError:
            # Fallback: create a basic itinerary structure
            return self._create_fallback_itinerary(destination, duration, budget, travelers)
    
    def _create_fallback_itinerary(
        self,
        destination: str,
        duration: int,
        budget: float,
        travelers: int
    ) -> List[Dict[str, Any]]:
        """Create a basic itinerary if LLM parsing fails"""
        daily_budget = budget / duration
        
        itinerary = []
        for day in range(1, duration + 1):
            itinerary.append({
                "day": day,
                "morning": {
                    "activities": ["Explore local area", "Visit main attractions"],
                    "location": "City center",
                    "estimated_cost": daily_budget * 0.3,
                    "duration_hours": 3
                },
                "afternoon": {
                    "activities": ["Cultural site visit", "Local market"],
                    "location": "Historic district",
                    "estimated_cost": daily_budget * 0.4,
                    "duration_hours": 4
                },
                "evening": {
                    "activities": ["Dinner", "Evening entertainment"],
                    "location": "Downtown area",
                    "estimated_cost": daily_budget * 0.3,
                    "duration_hours": 4
                },
                "meals": {
                    "breakfast": "Local cafe",
                    "lunch": "Traditional restaurant",
                    "dinner": "Fine dining",
                    "meal_cost": daily_budget * 0.4
                },
                "transportation": {
                    "method": "Public transport",
                    "cost": daily_budget * 0.1,
                    "notes": "Use local transport"
                },
                "daily_total": daily_budget
            })
        
        return itinerary
    
    def _check_budget_compliance(self, budget: float, total_cost: float) -> Dict[str, Any]:
        """Check if the itinerary fits within budget"""
        compliance_percentage = (total_cost / budget) * 100
        
        return {
            "within_budget": total_cost <= budget,
            "total_cost": total_cost,
            "budget": budget,
            "remaining": budget - total_cost,
            "compliance_percentage": compliance_percentage,
            "status": "within_budget" if total_cost <= budget else "over_budget"
        }
