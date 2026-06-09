from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.core.dependencies import get_current_user
from app.core.security import hash_password,verify_password,create_access_token
from app.schemas.auth import UserCreate,UserResponse,TokenResponse
from app.database import get_db
router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(data : UserCreate, db = Depends(get_db)):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists! Please try again.")
    hashed_password = hash_password(data.password)
    doc = {
        "name" : data.name,
        "email" : data.email,
        "hashed_password" : hashed_password,
        "role" : data.role,
        "is_active" : True
    }
    result = await db.users.insert_one(doc)
    doc["id"] = str(result.inserted_id)

    return UserResponse(
        id=str(result.inserted_id),
        name=data.name,
        email=data.email,
        role=doc["role"],
        is_active=doc["is_active"]
    )

@router.post("/login", response_model=TokenResponse)
async def login(form: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    user = await db.users.find_one({"email": form.username})
    if not user or not verify_password(form.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Find employee record by email
    employee = await db.employees.find_one({"email": form.username})
    employee_id = employee["employee_id"] if employee else None
    
    token = create_access_token({"sub": user["email"], "role": user["role"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"],
        "name": user["name"],
        "employee_id": employee_id
    }
@router.get("/me")
async def me(current_user = Depends(get_current_user)):
    current_user["id"] = str(current_user["_id"])
    current_user.pop("hashed_password", None)
    current_user.pop("_id", None)
    return current_user