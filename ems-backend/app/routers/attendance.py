from fastapi import APIRouter, HTTPException, Depends
from app.core.dependencies import get_current_user, require_role
from app.database import get_db
from app.schemas.attendance import AttendanceCreate
from datetime import date

router = APIRouter(prefix="/attendance", tags=["attendance"])

@router.post("/")
async def mark_attendance(data: AttendanceCreate, role=Depends(require_role("Admin", "H.R.")), db=Depends(get_db)):
    exist = await db.employees.find_one({"employee_id": data.employee_id})
    if not exist:
        raise HTTPException(status_code=404, detail="Employee not found")
    doc = {
        "employee_id": data.employee_id,
        "status": data.status,
        "check_in": data.check_in,
        "check_out": data.check_out,
        "date": data.date or str(date.today())
    }
    result = await db.attendance.insert_one(doc)
    doc.pop("_id", None)
    doc["id"] = str(result.inserted_id)
    return doc

@router.get("/{employee_id}")
async def get_attendance(employee_id: str, db=Depends(get_db), current_user=Depends(get_current_user)):
    records = await db.attendance.find({"employee_id": employee_id}).to_list(None)
    for r in records:
        r["id"] = str(r.pop("_id"))
    return {"records": records}

@router.get("/summary/{employee_id}")
async def attendance_summary(employee_id: str, db=Depends(get_db), current_user=Depends(get_current_user)):
    records = await db.attendance.find({"employee_id": employee_id}).to_list(None)
    summary = {"present": 0, "absent": 0, "late": 0, "total": len(records)}
    for r in records:
        if r.get("status") in summary:
            summary[r["status"]] += 1
    return {"employee_id": employee_id, "summary": summary}