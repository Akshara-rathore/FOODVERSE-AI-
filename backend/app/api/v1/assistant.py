from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.conversation import Conversation, ChatMessage
from app.schemas.assistant import ChatRequest, ConversationResponse, MessageResponse
from app.api.deps import get_current_user, get_ai
from app.services.ai.base import BaseAIProvider

router = APIRouter()


@router.post("/chat", response_model=MessageResponse)
async def chat_with_assistant(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    ai_provider: BaseAIProvider = Depends(get_ai)
):
    # Retrieve or create conversation
    conversation = None
    if request.conversation_id:
        conversation = db.query(Conversation).filter(
            Conversation.id == request.conversation_id,
            Conversation.user_id == current_user.id
        ).first()

    if not conversation:
        conversation_title = request.message[:35] + ("..." if len(request.message) > 35 else "")
        conversation = Conversation(
            user_id=current_user.id,
            title=conversation_title
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    # Save user message
    user_msg = ChatMessage(
        conversation_id=conversation.id,
        role="user",
        content=request.message,
        image_url=request.image_url
    )
    db.add(user_msg)
    db.commit()

    # Load prior conversation history
    past_messages = db.query(ChatMessage)\
        .filter(ChatMessage.conversation_id == conversation.id)\
        .order_by(ChatMessage.created_at.asc())\
        .all()

    history = [{"role": m.role, "content": m.content} for m in past_messages[:-1]]

    # Generate assistant reply
    assistant_reply = await ai_provider.assistant_chat(
        message=request.message,
        history=history,
        image_bytes=None
    )

    assistant_msg = ChatMessage(
        conversation_id=conversation.id,
        role="assistant",
        content=assistant_reply,
        metadata_info={"provider": "FoodVerse Multi-Modal Engine"}
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return assistant_msg


@router.get("/conversations", response_model=List[ConversationResponse])
def get_user_conversations(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversations = db.query(Conversation)\
        .filter(Conversation.user_id == current_user.id)\
        .order_by(Conversation.updated_at.desc())\
        .limit(limit)\
        .all()
    return conversations


@router.get("/conversations/{id}", response_model=ConversationResponse)
def get_conversation_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversation = db.query(Conversation).filter(
        Conversation.id == id,
        Conversation.user_id == current_user.id
    ).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    return conversation


@router.delete("/conversations/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversation = db.query(Conversation).filter(
        Conversation.id == id,
        Conversation.user_id == current_user.id
    ).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    db.delete(conversation)
    db.commit()
    return None
