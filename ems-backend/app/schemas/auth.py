from pydantic import BaseModel, EmailStr
from typing import Literal, Optional
class UserCreate(BaseModel):
    name : str
    email : str
    password : str
    role : Literal["Employee","H.R.","Admin"] = "Employee"

class UserResponse(BaseModel):
    id : str
    name : str
    email : EmailStr
    role : str
    is_active : bool

class TokenResponse(BaseModel):
    access_token : str
    token_type : str = "bearer"
    role : str
    name : str
    employee_id: Optional[str] = None