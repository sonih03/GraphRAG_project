import asyncio
from typing import Optional
from app.core.config import settings
from app.core.logging import logger


class LLMService:
    """
    Gemini API Service using the new google-genai SDK (google.genai).
    Replaces deprecated google.generativeai (google-generativeai) package.
    Model: gemini-2.5-flash (공식 제공 모델, 2025년 기준 최신 Flash)
    """

    def __init__(self):
        self._client = None
        self._model_name = "gemini-3.6-flash"  # Verified working model for this API key

    def _get_client(self):
        """Lazily initialize the google.genai client with API key from settings."""
        if self._client is None:
            key = settings.GEMINI_API_KEY or ""
            if not key or key.startswith("your_"):
                logger.error(
                    f"[ERROR] GEMINI_API_KEY is missing or still placeholder. "
                    f"Current value: '{key[:20] if key else 'EMPTY'}'"
                )
                return None
            try:
                from google import genai
                self._client = genai.Client(api_key=key)
                logger.info(f"[SUCCESS] Gemini client initialized (new SDK). Key prefix: {key[:8]}...")
            except Exception as e:
                logger.error(f"[ERROR] Failed to initialize Gemini client: {e}")
                return None
        return self._client

    async def generate_completion(self, prompt: str, system_prompt: str = "") -> str:
        """
        Calls Gemini API via the new google-genai SDK.
        Falls back to Groq (if available) or raises on complete failure.
        """
        client = self._get_client()

        if client is not None:
            try:
                from google.genai import types as genai_types

                # Build system instruction content
                system_instruction = system_prompt if system_prompt else None

                logger.info(
                    f"[API CALL] Calling Gemini ({self._model_name}) | "
                    f"prompt: {len(prompt)} chars | "
                    f"system: {len(system_instruction or '')} chars"
                )

                # Run synchronous SDK call in thread pool to avoid blocking event loop
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    None,
                    lambda: client.models.generate_content(
                        model=self._model_name,
                        contents=prompt,
                        config=genai_types.GenerateContentConfig(
                            system_instruction=system_instruction,
                            temperature=0.2,
                        ) if system_instruction else genai_types.GenerateContentConfig(
                            temperature=0.2,
                        ),
                    )
                )

                result_text = response.text or ""
                logger.info(f"[SUCCESS] Gemini response received: {len(result_text)} chars")
                return result_text

            except Exception as e:
                logger.error(f"[ERROR] Gemini API call failed: {type(e).__name__}: {e}")
                # Try Groq fallback
                groq_result = await self._try_groq_fallback(prompt, system_prompt)
                if groq_result is not None:
                    return groq_result
                raise e

        # No Gemini client — try Groq
        groq_result = await self._try_groq_fallback(prompt, system_prompt)
        if groq_result is not None:
            return groq_result

        # Nothing available
        logger.warning("[WARNING] No LLM clients available. Returning error message.")
        raise RuntimeError("Gemini API Key가 설정되지 않았거나 유효하지 않습니다.")

    async def _try_groq_fallback(self, prompt: str, system_prompt: str = "") -> Optional[str]:
        """Attempt to use Groq as fallback LLM."""
        try:
            from groq import Groq
            key = settings.GROQ_API_KEY or ""
            if not key or key.startswith("your_"):
                return None
            groq_client = Groq(api_key=key)
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})

            logger.info("[FALLBACK] Falling back to Groq LLM...")
            loop = asyncio.get_event_loop()
            completion = await loop.run_in_executor(
                None,
                lambda: groq_client.chat.completions.create(
                    model=settings.GROQ_MODEL,
                    messages=messages,
                    temperature=0.2,
                )
            )
            return completion.choices[0].message.content or ""
        except Exception as e:
            logger.warning(f"[WARNING] Groq fallback also failed: {e}")
            return None


llm_service = LLMService()
