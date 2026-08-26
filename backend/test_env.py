import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings

print("ROOT_DIR env files:", settings.model_config.get("env_file"))
print("NEO4J_URI:", settings.NEO4J_URI)
print("GEMINI_API_KEY:", settings.GEMINI_API_KEY)
