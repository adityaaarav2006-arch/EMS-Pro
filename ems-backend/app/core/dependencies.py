from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from app.core.security import decode_access_token
from app.database import get_db

security = HTTPBearer()

async def get_current_user(credentials = Depends(security),db = Depends(get_db)):
    token_string = credentials.credentials
    payload = decode_access_token(token_string)


    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    email = payload.get("sub")
    user = await db.users.find_one({"email":email})

    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    return user

def require_role(*roles : str):
    async def check_role(current_user = Depends(get_current_user)):
        if current_user["role"] not in roles:
            raise HTTPException(status_code=403, detail="User access denied.")
        return current_user
    return check_role





