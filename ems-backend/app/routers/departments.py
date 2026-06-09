from fastapi import APIRouter, HTTPException, Depends
from app.core.dependencies import get_current_user, require_role
from app.database import get_db

router = APIRouter(prefix="/departments", tags=["departments"])

@router.get("/{dept_name}")
async def get_department(dept_name: str, db=Depends(get_db), current_user=Depends(get_current_user)):
    dept = await db.departments.find_one({"name": dept_name})
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    dept["id"] = str(dept.pop("_id"))
    return dept

@router.post("/")
async def create_department(name: str, description: str = None, role=Depends(require_role("Admin")), db=Depends(get_db)):
    exist = await db.departments.find_one({"name": name})
    if exist:
        raise HTTPException(status_code=400, detail="Department already exists")
    doc = {"name": name, "description": description}
    result = await db.departments.insert_one(doc)
    doc.pop("_id", None)
    doc["id"] = str(result.inserted_id)
    return doc

@router.delete("/{dept_name}")
async def delete_department(dept_name: str, role=Depends(require_role("Admin")), db=Depends(get_db)):
    result = await db.departments.delete_one({"name": dept_name})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Department not found")
    return {"message": "Department deleted successfully"}

@router.get("/")
async def list_departments(db=Depends(get_db), current_user=Depends(get_current_user)):
    depts = await db.departments.find({}).to_list(None)
    for d in depts:
        d["id"] = str(d.pop("_id"))
        d["employee_count"] = await db.employees.count_documents({
            "department": d["name"],
            "status": "active"
        })
    return depts
