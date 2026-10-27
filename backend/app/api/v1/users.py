from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_user_profile(
    update_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if update_data.name is not None:
        current_user.name = update_data.name.strip()
    if update_data.preferences is not None:
        merged = dict(current_user.preferences or {})
        merged.update(update_data.preferences)
        current_user.preferences = merged

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
