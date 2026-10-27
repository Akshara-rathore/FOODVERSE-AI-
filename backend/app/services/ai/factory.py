from typing import Optional
from app.core.config import settings
from app.services.ai.base import BaseAIProvider
from app.services.ai.gemini_provider import GeminiProvider
from app.services.ai.openai_provider import OpenAIProvider


def get_ai_provider(provider_type: Optional[str] = None) -> BaseAIProvider:
    """Factory to retrieve configured AI provider."""
    target = (provider_type or settings.AI_PROVIDER).lower()
    if target == "openai":
        return OpenAIProvider()
    # Default to Gemini
    return GeminiProvider()
