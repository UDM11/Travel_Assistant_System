from typing import List, Dict, Any
from ..memory.vector_memory import VectorMemory

class Retriever:
    def __init__(self):
        self.vector_memory = VectorMemory()
        self.knowledge_base = self._load_knowledge_base()
    
    async def retrieve_relevant_info(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        query_embedding = self.vector_memory.create_mock_embedding(query)
        results = await self.vector_memory.similarity_search(query_embedding, top_k)
        
        # Add knowledge base results
        kb_results = self._search_knowledge_base(query)
        results.extend(kb_results)
        
        return results[:top_k]
    
    def _load_knowledge_base(self) -> List[Dict[str, Any]]:
        return [
            {"topic": "travel_tips", "content": "Book flights 6-8 weeks in advance for best prices"},
            {"topic": "packing", "content": "Pack light and bring essentials only"},
            {"topic": "safety", "content": "Always inform someone about your travel plans"}
        ]
    
    def _search_knowledge_base(self, query: str) -> List[Dict[str, Any]]:
        # Simple keyword matching
        results = []
        for item in self.knowledge_base:
            if any(word.lower() in item["content"].lower() for word in query.split()):
                results.append({
                    "doc_id": item["topic"],
                    "text": item["content"],
                    "similarity": 0.8
                })
        return results