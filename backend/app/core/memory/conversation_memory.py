from typing import Dict, Any, List
import json
from datetime import datetime

class ConversationMemory:
    def __init__(self):
        self.conversations = []
        self.plans = []
        self.summaries = []
    
    async def store_conversation(self, user_input: str, agent_response: str) -> None:
        conversation = {
            "timestamp": datetime.now().isoformat(),
            "user_input": user_input,
            "agent_response": agent_response
        }
        self.conversations.append(conversation)
    
    async def store_plan(self, plan: Dict[str, Any]) -> None:
        plan["timestamp"] = datetime.now().isoformat()
        self.plans.append(plan)
    
    async def store_summary(self, summary: Dict[str, Any]) -> None:
        summary["timestamp"] = datetime.now().isoformat()
        self.summaries.append(summary)
    
    def get_recent_conversations(self, limit: int = 5) -> List[Dict[str, Any]]:
        return self.conversations[-limit:]
    
    def get_conversation_context(self) -> str:
        recent = self.get_recent_conversations(3)
        return " ".join([f"User: {c['user_input']} Agent: {c['agent_response']}" for c in recent])