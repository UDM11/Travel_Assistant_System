from typing import Dict, Any, List, Optional
from datetime import datetime
import json
import redis
from collections import deque

from app.core.config import settings


class ConversationMemory:
    """
    Manages conversation history using Redis or local memory
    """
    
    def __init__(self):
        self.max_size = settings.CONVERSATION_MEMORY_SIZE
        try:
            self.redis_client = redis.from_url(settings.REDIS_URL)
            self.use_redis = True
        except Exception as e:
            print(f"⚠️ Redis not available, using local memory: {str(e)}")
            self.redis_client = None
            self.use_redis = False
        
        # Local memory fallback
        self.local_memory = {}
    
    async def add_conversation(
        self,
        session_id: str,
        user_input: str,
        agent_response: str,
        metadata: Dict[str, Any] = None
    ) -> bool:
        """
        Add a conversation turn to memory
        """
        try:
            conversation_turn = {
                "timestamp": datetime.utcnow().isoformat(),
                "user_input": user_input,
                "agent_response": agent_response,
                "metadata": metadata or {}
            }
            
            if self.use_redis:
                return await self._add_to_redis(session_id, conversation_turn)
            else:
                return self._add_to_local(session_id, conversation_turn)
                
        except Exception as e:
            print(f"❌ Failed to add conversation: {str(e)}")
            return False
    
    async def _add_to_redis(self, session_id: str, conversation_turn: Dict[str, Any]) -> bool:
        """Add conversation to Redis"""
        try:
            key = f"conversation:{session_id}"
            
            # Add to list
            self.redis_client.lpush(key, json.dumps(conversation_turn))
            
            # Trim to max size
            self.redis_client.ltrim(key, 0, self.max_size - 1)
            
            # Set expiration (24 hours)
            self.redis_client.expire(key, 86400)
            
            return True
        except Exception as e:
            print(f"❌ Redis add failed: {str(e)}")
            return False
    
    def _add_to_local(self, session_id: str, conversation_turn: Dict[str, Any]) -> bool:
        """Add conversation to local memory"""
        try:
            if session_id not in self.local_memory:
                self.local_memory[session_id] = deque(maxlen=self.max_size)
            
            self.local_memory[session_id].appendleft(conversation_turn)
            return True
        except Exception as e:
            print(f"❌ Local memory add failed: {str(e)}")
            return False
    
    async def get_conversation_history(
        self,
        session_id: str,
        limit: int = None
    ) -> List[Dict[str, Any]]:
        """
        Get conversation history for a session
        """
        try:
            if self.use_redis:
                return await self._get_from_redis(session_id, limit)
            else:
                return self._get_from_local(session_id, limit)
                
        except Exception as e:
            print(f"❌ Failed to get conversation history: {str(e)}")
            return []
    
    async def _get_from_redis(self, session_id: str, limit: int = None) -> List[Dict[str, Any]]:
        """Get conversation from Redis"""
        try:
            key = f"conversation:{session_id}"
            
            if limit:
                conversations = self.redis_client.lrange(key, 0, limit - 1)
            else:
                conversations = self.redis_client.lrange(key, 0, -1)
            
            return [json.loads(conv) for conv in conversations]
        except Exception as e:
            print(f"❌ Redis get failed: {str(e)}")
            return []
    
    def _get_from_local(self, session_id: str, limit: int = None) -> List[Dict[str, Any]]:
        """Get conversation from local memory"""
        try:
            if session_id not in self.local_memory:
                return []
            
            conversations = list(self.local_memory[session_id])
            if limit:
                conversations = conversations[:limit]
            
            return conversations
        except Exception as e:
            print(f"❌ Local memory get failed: {str(e)}")
            return []
    
    async def clear_conversation(self, session_id: str) -> bool:
        """
        Clear conversation history for a session
        """
        try:
            if self.use_redis:
                key = f"conversation:{session_id}"
                self.redis_client.delete(key)
            else:
                if session_id in self.local_memory:
                    del self.local_memory[session_id]
            
            return True
        except Exception as e:
            print(f"❌ Failed to clear conversation: {str(e)}")
            return False
    
    async def get_session_summary(self, session_id: str) -> Dict[str, Any]:
        """
        Get a summary of the conversation session
        """
        try:
            history = await self.get_conversation_history(session_id)
            
            if not history:
                return {
                    "session_id": session_id,
                    "total_turns": 0,
                    "first_interaction": None,
                    "last_interaction": None,
                    "topics": []
                }
            
            # Extract topics from conversations
            topics = []
            for conv in history:
                if "metadata" in conv and "topics" in conv["metadata"]:
                    topics.extend(conv["metadata"]["topics"])
            
            return {
                "session_id": session_id,
                "total_turns": len(history),
                "first_interaction": history[-1]["timestamp"] if history else None,
                "last_interaction": history[0]["timestamp"] if history else None,
                "topics": list(set(topics)),
                "recent_topics": topics[:5]  # Last 5 topics
            }
            
        except Exception as e:
            print(f"❌ Failed to get session summary: {str(e)}")
            return {"session_id": session_id, "error": str(e)}
    
    def get_memory_stats(self) -> Dict[str, Any]:
        """
        Get memory system statistics
        """
        try:
            if self.use_redis:
                # Get Redis stats
                info = self.redis_client.info()
                return {
                    "type": "redis",
                    "connected": True,
                    "memory_usage": info.get("used_memory_human", "unknown"),
                    "connected_clients": info.get("connected_clients", 0),
                    "total_keys": self.redis_client.dbsize()
                }
            else:
                # Get local memory stats
                total_sessions = len(self.local_memory)
                total_conversations = sum(len(conv) for conv in self.local_memory.values())
                
                return {
                    "type": "local",
                    "connected": True,
                    "total_sessions": total_sessions,
                    "total_conversations": total_conversations,
                    "max_size_per_session": self.max_size
                }
                
        except Exception as e:
            return {
                "type": "unknown",
                "connected": False,
                "error": str(e)
            }
