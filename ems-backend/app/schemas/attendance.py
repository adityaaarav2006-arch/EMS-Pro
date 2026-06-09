from pydantic import BaseModel
from typing import Optional

class AttendanceCreate(BaseModel):
    employee_id: str
    status: str
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    date: Optional[str] = None
