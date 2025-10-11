import openai
import asyncio
from typing import Dict, Any, List
import json

from app.core.config import settings


class LLMClient:
    """
    Client for interacting with OpenAI API
    """
    
    def __init__(self):
        self.client = openai.AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_BASE_URL
        )
        self.model = settings.OPENAI_MODEL
        self.temperature = settings.AGENT_TEMPERATURE
        self.max_tokens = settings.MAX_TOKENS
    
    async def generate_response(
        self,
        prompt: str,
        system_message: str = None,
        temperature: float = None
    ) -> str:
        """
        Generate a response using OpenAI API
        """
        try:
            messages = []
            
            if system_message:
                messages.append({"role": "system", "content": system_message})
            
            messages.append({"role": "user", "content": prompt})
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature or self.temperature,
                max_tokens=self.max_tokens
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"❌ LLM API error: {str(e)}")
            raise Exception(f"Failed to generate response: {str(e)}")
    
    async def generate_structured_response(
        self,
        prompt: str,
        schema: Dict[str, Any],
        system_message: str = None
    ) -> Dict[str, Any]:
        """
        Generate a structured JSON response
        """
        try:
            structured_prompt = f"""
            {prompt}
            
            Please respond with valid JSON matching this schema:
            {json.dumps(schema, indent=2)}
            """
            
            response = await self.generate_response(
                prompt=structured_prompt,
                system_message=system_message
            )
            
            # Try to parse JSON response
            try:
                return json.loads(response)
            except json.JSONDecodeError:
                # If JSON parsing fails, return the raw response
                return {"raw_response": response}
                
        except Exception as e:
            print(f"❌ Structured response error: {str(e)}")
            raise Exception(f"Failed to generate structured response: {str(e)}")
    
    async def analyze_text(
        self,
        text: str,
        analysis_type: str = "summary"
    ) -> str:
        """
        Analyze text for various purposes
        """
        prompts = {
            "summary": f"Summarize the following text:\n\n{text}",
            "sentiment": f"Analyze the sentiment of this text:\n\n{text}",
            "keywords": f"Extract key topics and keywords from:\n\n{text}",
            "translation": f"Translate this text to English:\n\n{text}"
        }
        
        prompt = prompts.get(analysis_type, prompts["summary"])
        
        return await self.generate_response(prompt)
    
    async def generate_embeddings(self, text: str) -> List[float]:
        """
        Generate embeddings for text
        """
        try:
            response = await self.client.embeddings.create(
                model="text-embedding-ada-002",
                input=text
            )
            
            return response.data[0].embedding
            
        except Exception as e:
            print(f"❌ Embedding generation error: {str(e)}")
            raise Exception(f"Failed to generate embeddings: {str(e)}")
    
    def get_model_info(self) -> Dict[str, Any]:
        """
        Get information about the current model
        """
        return {
            "model": self.model,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "base_url": settings.OPENAI_BASE_URL
        }
