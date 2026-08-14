from typing import Optional
from app.core.config import settings
from app.core.logging import logger

try:
    from groq import Groq
except ImportError:
    Groq = None

class LLMService:
    def __init__(self):
        self._client: Optional[Groq] = None

    @property
    def client(self) -> Optional[Groq]:
        if self._client is None and settings.GROQ_API_KEY and Groq:
            self._client = Groq(api_key=settings.GROQ_API_KEY)
        return self._client

    async def generate_completion(self, prompt: str, system_prompt: str = "") -> str:
        if not self.client:
            logger.warning("Groq API client not initialized (missing API key or SDK)")
            return f"[Simulated Response] Echo prompt: {prompt}"
        
        try:
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})

            completion = self.client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=messages,
                temperature=0.2,
            )
            return completion.choices[0].message.content or ""
        except Exception as e:
            logger.error(f"Error calling Groq LLM: {e}")
            raise e

llm_service = LLMService()
