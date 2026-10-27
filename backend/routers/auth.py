from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from backend.auth import authenticate_user, create_access_token, get_current_user
from backend.schemas import Token, UserCreate, User

router = APIRouter()

# In-memory user store for demo
users_db = {}

class RegisterRequest(BaseModel):
    username: str
    password: str
    email: str

@router.post("/register", response_model=User)
async def register(req: RegisterRequest):
    if req.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    user = User(username=req.username, email=req.email)
    users_db[req.username] = {
        "username": req.username,
        "email": req.email,
        "hashed_password": authenticate_user.get_password_hash(req.password),
    }
    return user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_me(current_user: dict = Depends(get_current_user)):
    return User(username=current_user["username"], email=current_user["email"])