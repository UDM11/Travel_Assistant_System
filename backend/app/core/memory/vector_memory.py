from typing import List, Dict, Any
import json

class VectorMemory:
    def __init__(self):
        self.embeddings = {}
        self.documents = {}
    
    async def store_embedding(self, doc_id: str, text: str, embedding: List[float]) -> None:
        self.embeddings[doc_id] = embedding
        self.documents[doc_id] = text
    
    async def similarity_search(self, query_embedding: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        # Simple mock similarity search
        results = []
        for doc_id, embedding in list(self.embeddings.items())[:top_k]:
            results.append({
                "doc_id": doc_id,
                "text": self.documents[doc_id],
                "similarity": 0.85  # Mock similarity score
            })
        return results
    
    def create_mock_embedding(self, text: str) -> List[float]:
        # Mock embedding generation
        return [0.1] * 384  # 384-dimensional mock embedding