import logging
import asyncio
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from google.genai import types as genai_types
from app.core.config import settings as app_settings
from app.services.llm_service import llm_service
from evaluation.config import eval_settings

logger = logging.getLogger("evaluation.normalizer")

class NormalizedQuery(BaseModel):
    original_intent: str = Field(description="사용자의 질문에 내포된 법률적 원천 의도 요약")
    primary_legal_terms: List[str] = Field(description="핵심 법률 개념 및 어휘 목록")
    related_rights: List[str] = Field(description="연관 법률 권리 청구권 명칭 목록")
    lucene_query_string: str = Field(description="Neo4j fulltext 인덱스 검색용 가중치 Lucene 쿼리 문자열")

class NormalizationResult(BaseModel):
    raw_query: str
    normalized_text: str
    legal_terms: List[str]
    lucene_query: str
    latency_ms: float
    input_tokens: int = 0
    output_tokens: int = 0
    cost_usd: float = 0.0

# Price settings for Gemini 3.6 Flash
PRICE_PER_TOKEN_INPUT = 0.075 / 1_000_000
PRICE_PER_TOKEN_OUTPUT = 0.30 / 1_000_000

class QueryNormalizer:
    def __init__(self):
        self._client = None
        self._model_name = "gemini-3.6-flash"

    def _get_client(self):
        if self._client is None:
            # Reuses API key from main settings or evaluation settings
            key = app_settings.GEMINI_API_KEY or ""
            if not key or key.startswith("your_"):
                logger.error("GEMINI_API_KEY is missing or invalid.")
                return None
            try:
                from google import genai
                self._client = genai.Client(api_key=key)
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client in normalizer: {e}")
                return None
        return self._client

    async def normalize(self, query: str) -> Optional[NormalizationResult]:
        client = self._get_client()
        if client is None:
            logger.warning("Gemini client not initialized. Skipping normalizer.")
            return None

        system_prompt = (
            "당신은 대한민국 민법 전문 수석 법률 AI 아키텍트입니다.\n"
            "사용자의 일상적인 자연어 질문을 대한민국 민법 조문 검색에 최적화된 표준 법률 용어 및 Lucene 쿼리로 변환합니다.\n\n"
            "[핵심 작성 규칙]\n"
            "1. 일상어 표현을 정확한 한자어 법률 용어로 매핑하되, 구체적 청구권 명칭뿐만 아니라 민법 조문에 직접 등장하는 '기본 일반 법률 어휘'를 반드시 함께 포함하십시오.\n"
            "   - 빌린 돈/채무 불이행 질의 -> '대여금반환'과 함께 '채무불이행', '이행지체', '손해배상' 포함\n"
            "   - 전세/보증금 질의 -> '임대차', '보증금반환'과 함께 '전세권' 포함\n"
            "   - 담벼락/땅 침범 질의 -> '소유물방해제거', '건물철거' 포함\n"
            "2. lucene_query_string 생성 시 주요 키워드들을 AND가 아닌 OR 연산자로 넓게 결합하여 검색 누락을 방지하십시오.\n"
            "3. 지정된 Pydantic JSON 스키마를 엄격히 준수하여 출력하십시오.\n\n"
            "[Few-shot Examples]\n"
            "예시 1:\n"
            "입력: 친구가 빌린 돈 500만원을 기한이 지났는데도 갚지 않고 피해요.\n"
            "출력:\n"
            "{\n"
            "  \"original_intent\": \"대여금 반환 지체에 따른 채무불이행 및 손해배상 청구\",\n"
            "  \"primary_legal_terms\": [\"채무불이행\", \"이행지체\", \"대여금반환\", \"손해배상\"],\n"
            "  \"related_rights\": [\"대여금반환청구권\", \"지연손해금청구권\"],\n"
            "  \"lucene_query_string\": \"(name:\\\"채무불이행\\\"^3.0 OR summary:\\\"채무불이행\\\"^2.0 OR fullText:\\\"채무불이행\\\"^1.0) OR (fullText:\\\"이행지체\\\" OR fullText:\\\"대여금\\\" OR fullText:\\\"손해배상\\\")\"\n"
            "}\n\n"
            "예시 2:\n"
            "입력: 집주인이 전세 계약이 끝났는데도 보증금을 안 돌려주는데 어쩌죠?\n"
            "출력:\n"
            "{\n"
            '  "original_intent": "전세계약 만료에 따른 전세금 및 보증금 반환 청구",\n'
            '  "primary_legal_terms": ["전세권", "전세금", "임대차", "보증금반환"],\n'
            '  "related_rights": ["전세금반환청구권", "임대차보증금반환청구권"],\n'
            '  "lucene_query_string": "(name:\\"전세권\\"^3.0 OR summary:\\"전세권\\"^2.0) OR (fullText:\\"전세금\\" OR fullText:\\"임대차\\" OR fullText:\\"보증금\\")"\n'
            "}\n"
        )
        
        prompt = f"사용자 질문: {query}\n정규화 정보:"

        import time
        start_time = time.perf_counter()

        try:
            response = await client.aio.models.generate_content(
                model=self._model_name,
                contents=prompt,
                config=genai_types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    response_mime_type="application/json",
                    response_schema=NormalizedQuery,
                    temperature=0.0,
                    top_p=0.1,
                    top_k=1,
                    automatic_function_calling={"disable": True},
                )
            )
            
            end_time = time.perf_counter()
            latency_ms = (end_time - start_time) * 1000

            # Parse structured JSON output
            import json
            data = json.loads(response.text)
            legal_terms = data.get("primary_legal_terms", [])
            lucene_query = data.get("lucene_query_string", "")
            normalized_text = " ".join(legal_terms)

            # Calculate token usage and cost
            usage = response.usage_metadata
            input_tokens = usage.prompt_token_count if usage else 0
            output_tokens = usage.candidates_token_count if usage else 0
            cost = (input_tokens * PRICE_PER_TOKEN_INPUT) + (output_tokens * PRICE_PER_TOKEN_OUTPUT)

            return NormalizationResult(
                raw_query=query,
                normalized_text=normalized_text,
                legal_terms=legal_terms,
                lucene_query=lucene_query,
                latency_ms=latency_ms,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                cost_usd=cost
            )
            
        except Exception as e:
            logger.error(f"Gemini Query Normalization failed: {e}")
            return None

normalizer = QueryNormalizer()
