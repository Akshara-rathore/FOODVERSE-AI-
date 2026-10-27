from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    image_url: Optional[str] = None


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    image_url: Optional[str] = None
    metadata_info: Dict[str, Any] = {}
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ConversationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = []

    model_config = ConfigDict(from_attributes=True)
