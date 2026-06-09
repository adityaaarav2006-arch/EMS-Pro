from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.core.dependencies import get_current_user, require_role
from app.database import get_db
from app.services.ai_service import (
    generate_employee_summary,
    generate_performance_insights,
    natural_language_search,
    generate_hr_report
)

router = APIRouter(prefix="/ai", tags=["AI Insights"])

class SearchRequest(BaseModel):
    query: str

@router.get("/summary/{employee_id}")
async def employee_summary(employee_id: str, db=Depends(get_db), role=Depends(require_role("Admin", "H.R."))):
    employee = await db.employees.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    summary = await generate_employee_summary(employee)
    return {"employee_id": employee_id, "summary": summary}

@router.get("/performance-insights")
async def performance_insights(db=Depends(get_db), role=Depends(require_role("Admin", "H.R."))):
    employees = await db.employees.find().to_list(None)
    insights = await generate_performance_insights(employees)
    return {"insights": insights}

@router.post("/search")
async def nl_search(body: SearchRequest, db=Depends(get_db), current_user=Depends(get_current_user)):
    employees = await db.employees.find().to_list(None)
    matching_ids = await natural_language_search(body.query, employees)
    if not matching_ids:
        return {"query": body.query, "results": []}
    results = await db.employees.find({"employee_id": {"$in": matching_ids}}).to_list(None)
    for r in results:
        r["id"] = str(r.pop("_id"))
    return {"query": body.query, "results": results}

@router.get("/hr-report")
async def hr_report(db=Depends(get_db), role=Depends(require_role("Admin", "H.R."))):
    from app.routers.analytics import dashboard_stats
    stats = await dashboard_stats(db=db, current_user=None)
    report = await generate_hr_report(stats)
    return {"report": report}
