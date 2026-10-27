from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, hash_password, create_access_token
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, Token
from app.schemas.user import UserResponse
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    new_user = User(
        name=request.name.strip(),
        email=request.email.lower().strip(),
        password_hash=hash_password(request.password),
        preferences={
            "dietary_preference": "None",
            "daily_calorie_goal": 2000,
            "allergies": []
        }
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(subject=new_user.email)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email.lower().strip()).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    token = create_access_token(subject=user.email)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def get_current_authenticated_user(current_user: User = Depends(get_current_user)):
    return current_user
