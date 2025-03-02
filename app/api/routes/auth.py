from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson.objectid import ObjectId

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.mongodb import get_database
from app.models.user import User, UserCreate, UserInDB
from app.models.token import Token

router = APIRouter()

@router.post("/register", response_model=User)
async def register_user(
    user_in: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> Any:
    """
    Register a new user.
    """
    # Check if user with this email already exists
    existing_user = await db.users.find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    
    # Create new user
    user_id = str(ObjectId())
    user_doc = {
        "_id": user_id,
        "email": user_in.email,
        "hashed_password": get_password_hash(user_in.password),
        "full_name": user_in.full_name,
        "is_active": True,
        "created_at": user_in.created_at if hasattr(user_in, 'created_at') else None
    }
    
    await db.users.insert_one(user_doc)
    
    return {
        "_id": user_id,
        "email": user_in.email,
        "is_active": True,
        "full_name": user_in.full_name,
        "created_at": user_doc["created_at"]
    }

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user["_id"], expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }