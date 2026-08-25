from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from app.core.config import settings as app_settings

class EvaluationSettings(BaseSettings):
    # Redis configuration
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Optional[str] = None
    
    # Model configuration
    EMBEDDING_MODEL: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2" # Multilingual model, 384 dimensions
    RERANKER_MODEL: str = "BAAI/bge-reranker-base" # CPU-optimized ONNX format through fastembed
    
    # SLA thresholds
    SLA_LIMIT_MS: int = 1500
    GEMINI_TIMEOUT_MS: int = 15000
    
    # Gemini API Key
    GEMINI_API_KEY: Optional[str] = None

    # Pydantic env config
    model_config = SettingsConfigDict(
        env_file=app_settings.model_config.get("env_file"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

eval_settings = EvaluationSettings()
