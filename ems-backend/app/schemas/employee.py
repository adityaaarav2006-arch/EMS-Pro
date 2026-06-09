from pydantic import BaseModel, Field
from typing import Literal,Optional
from datetime import date
class EmployeeCreate(BaseModel):
    name : str
    email : str
    designation : str
    department : str
    date_of_joining : date
    employee_id : str = Field(...,pattern=r"^EMP\d{4}$")
    status : Literal["active","inactive","on_leave"]
    salary : Optional[float] = None
    skills : list[str] = []

class EmployeeResponse(BaseModel):
    id : str
    name : str
    email : str
    designation : str
    department : str
    date_of_joining : date
    employee_id : str = Field(...,pattern=r"^EMP\d{4}$")
    status : Literal["active","inactive","on_leave"]
    salary : Optional[float] = None
    skills : list[str] = []

class EmployeeUpdate(BaseModel):
    name : Optional[str] = None
    email : Optional[str] = None
    designation : Optional[str] = None
    department : Optional[str] = None
    date_of_joining : Optional[date] = None
    employee_id : Optional[str] = Field(None, pattern=r"^EMP\d{4}$")
    status : Optional[Literal["active","inactive","on_leave"]] = None
    salary : Optional[float] = None
    skills : Optional[list[str]] = None