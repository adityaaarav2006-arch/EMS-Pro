from fastapi import APIRouter, HTTPException, status, Depends
from app.core.dependencies import get_current_user,require_role
from app.schemas.employee import EmployeeCreate, EmployeeUpdate
from app.database import get_db

router = APIRouter(prefix="/employees", tags=["employees"])

@router.get("/")
async def get_all_employees(db = Depends(get_db),current_user = Depends(get_current_user)):
    emps = await db.employees.find().to_list(None)
    for emp in emps:
        emp["id"] = str(emp.pop("_id"))
    return emps

@router.get('/{employee_id}')
async def get_employee(employee_id : str,current_user = Depends(get_current_user), db = Depends(get_db)):
    emp_record = await db.employees.find_one({"employee_id":employee_id})
    if not emp_record:
        raise HTTPException(status_code=404,detail="Employee Not Found")
    emp_record["id"] = str(emp_record.pop("_id"))
    return emp_record

@router.post("/")
async def insert_employee(data : EmployeeCreate,role = Depends(require_role("Admin","H.R.")),db = Depends(get_db)):
    exist = await db.employees.find_one({
        "$or": [
            {"email": data.email},
            {"employee_id": data.employee_id}
        ]
    })
    if exist:
        raise HTTPException(status_code=401,detail="Employee already registered in the system!")
    doc = data.model_dump(mode="json")
    new_emp = await db.employees.insert_one(doc)
    doc.pop("_id", None)
    doc["id"] = str(new_emp.inserted_id)
    return doc

@router.delete("/{employee_id}")
async def delete_employee(employee_id: str, role=Depends(require_role("Admin", "H.R.")), db=Depends(get_db)):
    result = await db.employees.delete_one({"employee_id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}

@router.put("/{employee_id}")
async def update_employee(employee_id: str, data: EmployeeUpdate, role=Depends(require_role("Admin", "H.R.")), db=Depends(get_db)):
    update_data = {k: v for k, v in data.model_dump(mode="json").items() if v is not None}
    result = await db.employees.find_one_and_update(
        {"employee_id": employee_id},
        {"$set": update_data},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Employee not found")
    result["id"] = str(result.pop("_id"))
    return result