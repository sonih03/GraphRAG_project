import logging
import asyncio
import re
from typing import List, Dict, Any, Set
from kiwipiepy import Kiwi
from evaluation.database import db
from evaluation.normalizer import normalizer, NormalizationResult
from evaluation.config import eval_settings

logger = logging.getLogger("evaluation.kiwi_router")

class KiwiRouter:
    def __init__(self, legal_word_threshold: float = 0.80):
        self.kiwi = Kiwi()
        self.legal_dictionary: Set[str] = set()
        self.legal_word_threshold = legal_word_threshold
        self._initialized = False

    async def initialize(self):
        """Asynchronously builds the legal dictionary from Neo4j node metadata."""
        if self._initialized:
            return
            
        logger.info("Initializing Kiwi morphological router and building legal dictionary...")
        try:
            driver = db.get_neo4j_driver()
            # Fetch all Article names and summaries to extract legal words
            query = "MATCH (a:Article) RETURN a.name AS name, a.summary AS summary"
            
            names_and_summaries = []
            async with driver.session() as session:
                result = await session.run(query)
                async for record in result:
                    name = record["name"] or ""
                    summary = record["summary"] or ""
                    names_and_summaries.append((name, summary))
            
            if not names_and_summaries:
                logger.warning("No Neo4j article data found to build legal dictionary. Using fallback dictionary.")
                self._load_fallback_dict()
                self._initialized = True
                return

            # Extract nouns in a separate thread to avoid blocking loop
            await asyncio.to_thread(self._extract_and_register_nouns, names_and_summaries)
            self._initialized = True
            logger.info(f"Kiwi legal dictionary initialized with {len(self.legal_dictionary)} unique terms.")
            
        except Exception as e:
            logger.error(f"Failed to build Kiwi legal dictionary: {e}. Loading fallback dictionary.")
            self._load_fallback_dict()
            self._initialized = True

    def _extract_and_register_nouns(self, data_list: List[tuple]):
        # Extract general legal terms from title/summary using Kiwi
        temp_set = set()
        
        # Add basic legal nouns to boost recognition
        basic_terms = [
            "소유물방해제거", "소유물방해제거청구권", "소유물반환청구권", "소유권", "지상권", "전세권", "유치권", "저당권",
            "채무불이행", "손해배상", "손해배상청구권", "부당이득", "부당이득반환", "취득시효", "점유취득시효", 
            "임대차", "임대차보증금", "임차권등기명령", "피한정후견인", "행위능력", "피특정후견인", "소멸시효"
        ]
        for term in basic_terms:
            temp_set.add(term)
            self.kiwi.add_user_word(term, "NNP")

        # Process DB texts
        for name, summary in data_list:
            # Add full article titles as proper nouns
            clean_name = re.sub(r'[\(\)]', '', name).strip()
            if clean_name and len(clean_name) >= 2:
                temp_set.add(clean_name)
            
            # Extract nouns from summaries/names
            for text in [name, summary]:
                if not text:
                    continue
                tokens = self.kiwi.tokenize(text)
                for token in tokens:
                    # NNG (general noun), NNP (proper noun)
                    if token.tag in ("NNG", "NNP") and len(token.form) >= 2:
                        temp_set.add(token.form)
                        
        self.legal_dictionary.update(temp_set)

    def _load_fallback_dict(self):
        fallback_terms = [
            "소유물방해제거", "소유물방해제거청구권", "소유물반환청구권", "소유권", "지상권", "전세권", "유치권", "저당권",
            "채무불이행", "손해배상", "손해배상청구권", "부당이득", "부당이득반환", "취득시효", "점유취득시효", 
            "임대차", "임대차보증금", "임차권등기명령", "피한정후견인", "행위능력", "피특정후견인", "소멸시효"
        ]
        for term in fallback_terms:
            self.legal_dictionary.add(term)
            self.kiwi.add_user_word(term, "NNP")

    def get_legal_word_ratio(self, query: str) -> float:
        """Calculates the ratio of legal nouns to total nouns in the query."""
        tokens = self.kiwi.tokenize(query)
        nouns = [t.form for t in tokens if t.tag.startswith("NN") and len(t.form) >= 2]
        
        if not nouns:
            return 0.0
            
        legal_nouns = [n for n in nouns if n in self.legal_dictionary]
        ratio = len(legal_nouns) / len(nouns)
        logger.debug(f"Query nouns: {nouns} | Legal matched: {legal_nouns} | Ratio: {ratio:.2f}")
        return ratio

    def extract_kiwi_keywords(self, query: str) -> List[str]:
        """Extracts nouns from the query to be used as fallback keywords."""
        tokens = self.kiwi.tokenize(query)
        return [t.form for t in tokens if t.tag.startswith("NN") and len(t.form) >= 2]

    async def route_and_normalize(self, query: str) -> Dict[str, Any]:
        """
        Determines query routing. Normalizes query via LLM if ratio is low.
        Applies a strict timeout on LLM query normalization, falling back to Kiwi keywords.
        """
        await self.initialize()
        
        # 1. Check legal vocabulary ratio
        ratio = self.get_legal_word_ratio(query)
        
        # If the query is already formal legal statement, skip LLM normalization (fast path)
        if ratio >= self.legal_word_threshold:
            logger.info(f"High legal word ratio ({ratio:.2f} >= {self.legal_word_threshold}). Skipping LLM Normalization.")
            kiwi_keywords = self.extract_kiwi_keywords(query)
            lucene_query = " OR ".join([f"{kw}^1.0" for kw in kiwi_keywords])
            return {
                "method": "KiwiRouter (Ratio FastPath)",
                "normalized_text": " ".join(kiwi_keywords),
                "legal_terms": kiwi_keywords,
                "lucene_query": lucene_query,
                "latency_ms": 0.0,
                "input_tokens": 0,
                "output_tokens": 0,
                "cost_usd": 0.0,
                "timed_out": False
            }
            
        # 2. Call Gemini normalizer with strict timeout
        timeout_seconds = eval_settings.GEMINI_TIMEOUT_MS / 1000.0
        logger.info(f"Low legal word ratio ({ratio:.2f} < {self.legal_word_threshold}). Calling Gemini with {timeout_seconds}s timeout...")
        
        try:
            # asyncio.wait_for applies timeout control
            result: Optional[NormalizationResult] = await asyncio.wait_for(
                normalizer.normalize(query),
                timeout=timeout_seconds
            )
            
            if result is not None:
                return {
                    "method": "Gemini Normalizer",
                    "normalized_text": result.normalized_text,
                    "legal_terms": result.legal_terms,
                    "lucene_query": result.lucene_query,
                    "latency_ms": result.latency_ms,
                    "input_tokens": result.input_tokens,
                    "output_tokens": result.output_tokens,
                    "cost_usd": result.cost_usd,
                    "timed_out": False
                }
            
        except asyncio.TimeoutError:
            logger.warning(f"Gemini normalization timed out (> {eval_settings.GEMINI_TIMEOUT_MS}ms). Falling back to Kiwi keywords.")
        except Exception as e:
            logger.error(f"Error during normalizer call: {e}. Falling back to Kiwi keywords.")

        # Fallback path on timeout or error
        kiwi_keywords = self.extract_kiwi_keywords(query)
        lucene_query = " OR ".join([f"{kw}^1.0" for kw in kiwi_keywords])
        return {
            "method": "KiwiRouter (Fallback)",
            "normalized_text": " ".join(kiwi_keywords),
            "legal_terms": kiwi_keywords,
            "lucene_query": lucene_query,
            "latency_ms": 0.0,
            "input_tokens": 0,
            "output_tokens": 0,
            "cost_usd": 0.0,
            "timed_out": True
        }

kiwi_router = KiwiRouter()
