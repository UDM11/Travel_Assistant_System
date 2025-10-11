import chromadb
from typing import Dict, Any, List, Optional
import json
from datetime import datetime

from app.core.config import settings
from app.services.llm_client import LLMClient


class VectorStore:
    """
    Manages vector storage for travel knowledge using ChromaDB
    """
    
    def __init__(self):
        self.client = chromadb.PersistentClient(path=settings.CHROMA_PATH)
        self.collection_name = settings.VECTOR_STORE_COLLECTION
        self.llm_client = LLMClient()
        
        # Initialize or get collection
        try:
            self.collection = self.client.get_collection(name=self.collection_name)
        except Exception:
            self.collection = self.client.create_collection(
                name=self.collection_name,
                metadata={"description": "Travel knowledge and guides"}
            )
    
    async def add_travel_guide(
        self,
        destination: str,
        content: str,
        metadata: Dict[str, Any] = None
    ) -> bool:
        """
        Add travel guide content to vector store
        """
        try:
            # Generate embedding
            embedding = await self.llm_client.generate_embeddings(content)
            
            # Prepare metadata
            doc_metadata = {
                "destination": destination,
                "content_type": "travel_guide",
                "created_at": datetime.utcnow().isoformat(),
                **(metadata or {})
            }
            
            # Generate unique ID
            doc_id = f"{destination}_{datetime.utcnow().timestamp()}"
            
            # Add to collection
            self.collection.add(
                embeddings=[embedding],
                documents=[content],
                metadatas=[doc_metadata],
                ids=[doc_id]
            )
            
            return True
            
        except Exception as e:
            print(f"❌ Failed to add travel guide: {str(e)}")
            return False
    
    async def search_similar_content(
        self,
        query: str,
        destination: str = None,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Search for similar content in vector store
        """
        try:
            # Generate query embedding
            query_embedding = await self.llm_client.generate_embeddings(query)
            
            # Prepare where clause for filtering
            where_clause = {}
            if destination:
                where_clause["destination"] = destination
            
            # Search collection
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=limit,
                where=where_clause if where_clause else None
            )
            
            # Format results
            formatted_results = []
            if results["documents"] and results["documents"][0]:
                for i, doc in enumerate(results["documents"][0]):
                    formatted_results.append({
                        "content": doc,
                        "metadata": results["metadatas"][0][i],
                        "distance": results["distances"][0][i],
                        "id": results["ids"][0][i]
                    })
            
            return formatted_results
            
        except Exception as e:
            print(f"❌ Vector search failed: {str(e)}")
            return []
    
    async def get_destination_knowledge(
        self,
        destination: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Get all knowledge about a specific destination
        """
        try:
            results = self.collection.get(
                where={"destination": destination},
                limit=limit
            )
            
            formatted_results = []
            if results["documents"]:
                for i, doc in enumerate(results["documents"]):
                    formatted_results.append({
                        "content": doc,
                        "metadata": results["metadatas"][i],
                        "id": results["ids"][i]
                    })
            
            return formatted_results
            
        except Exception as e:
            print(f"❌ Failed to get destination knowledge: {str(e)}")
            return []
    
    async def add_user_feedback(
        self,
        trip_id: str,
        feedback: str,
        rating: int = None,
        metadata: Dict[str, Any] = None
    ) -> bool:
        """
        Add user feedback about a trip
        """
        try:
            # Generate embedding for feedback
            embedding = await self.llm_client.generate_embeddings(feedback)
            
            # Prepare metadata
            doc_metadata = {
                "content_type": "user_feedback",
                "trip_id": trip_id,
                "rating": rating,
                "created_at": datetime.utcnow().isoformat(),
                **(metadata or {})
            }
            
            # Generate unique ID
            doc_id = f"feedback_{trip_id}_{datetime.utcnow().timestamp()}"
            
            # Add to collection
            self.collection.add(
                embeddings=[embedding],
                documents=[feedback],
                metadatas=[doc_metadata],
                ids=[doc_id]
            )
            
            return True
            
        except Exception as e:
            print(f"❌ Failed to add user feedback: {str(e)}")
            return False
    
    async def get_recommendations(
        self,
        user_preferences: Dict[str, Any],
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Get personalized recommendations based on user preferences
        """
        try:
            # Create query from preferences
            query_parts = []
            if "interests" in user_preferences:
                query_parts.extend(user_preferences["interests"])
            if "budget_range" in user_preferences:
                query_parts.append(f"budget {user_preferences['budget_range']}")
            if "travel_style" in user_preferences:
                query_parts.append(user_preferences["travel_style"])
            
            query = " ".join(query_parts)
            
            # Search for relevant content
            results = await self.search_similar_content(query, limit=limit)
            
            return results
            
        except Exception as e:
            print(f"❌ Failed to get recommendations: {str(e)}")
            return []
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the vector store collection
        """
        try:
            count = self.collection.count()
            
            # Get sample metadata to understand content types
            sample_results = self.collection.get(limit=100)
            content_types = {}
            destinations = set()
            
            if sample_results["metadatas"]:
                for metadata in sample_results["metadatas"]:
                    content_type = metadata.get("content_type", "unknown")
                    content_types[content_type] = content_types.get(content_type, 0) + 1
                    
                    if "destination" in metadata:
                        destinations.add(metadata["destination"])
            
            return {
                "total_documents": count,
                "content_types": content_types,
                "unique_destinations": len(destinations),
                "collection_name": self.collection_name,
                "chroma_path": settings.CHROMA_PATH
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "collection_name": self.collection_name
            }
    
    async def initialize_sample_data(self) -> bool:
        """
        Initialize the vector store with sample travel data
        """
        try:
            sample_guides = [
                {
                    "destination": "Paris",
                    "content": "Paris is the capital of France and one of the most visited cities in the world. Known for its art, fashion, and cuisine, Paris offers iconic landmarks like the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral. The best time to visit is spring (April-June) or fall (September-November) when the weather is mild and crowds are smaller.",
                    "metadata": {"category": "general_info", "language": "en"}
                },
                {
                    "destination": "Tokyo",
                    "content": "Tokyo is Japan's bustling capital, blending ultra-modern architecture with traditional culture. Must-visit areas include Shibuya for shopping, Asakusa for temples, and Harajuku for youth culture. The city has excellent public transportation via JR trains and subway. Spring (March-May) for cherry blossoms or fall (September-November) for pleasant weather are ideal times to visit.",
                    "metadata": {"category": "general_info", "language": "en"}
                },
                {
                    "destination": "New York",
                    "content": "New York City is America's largest city and cultural capital. Key attractions include Central Park, Times Square, Statue of Liberty, and Broadway shows. The subway system provides comprehensive transportation. Spring and fall offer the best weather, while summer can be hot and humid. Budget travelers can find affordable accommodations in Brooklyn or Queens.",
                    "metadata": {"category": "general_info", "language": "en"}
                }
            ]
            
            for guide in sample_guides:
                await self.add_travel_guide(
                    destination=guide["destination"],
                    content=guide["content"],
                    metadata=guide["metadata"]
                )
            
            print(f"✅ Initialized vector store with {len(sample_guides)} sample guides")
            return True
            
        except Exception as e:
            print(f"❌ Failed to initialize sample data: {str(e)}")
            return False
