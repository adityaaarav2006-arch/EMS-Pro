from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.database import get_db
from datetime import timezone,datetime,timedelta
router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/dashboard")
async def dashboard_stats(db=Depends(get_db), current_user=Depends(get_current_user)):
    total = await db.employees.count_documents({})
    active = await db.employees.count_documents({"status": "active"})
    on_leave = await db.employees.count_documents({"status": "on_leave"})
    inactive = await db.employees.count_documents({"status": "inactive"})

    dept_pipeline = [
        {"$group": {"_id": "$department", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    dept_breakdown = await db.employees.aggregate(dept_pipeline).to_list(None)

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    today_present = await db.attendance.count_documents({"date": today, "status": "present"})
    today_absent  = await db.attendance.count_documents({"date": today, "status": "absent"})

    monthly_pipeline = [
        {"$match": {"date": {"$regex": r"^\d{4}-\d{2}-\d{2}$"}}},
        {"$group": {"_id": "$date", "present": {"$sum": {"$cond": [{"$eq": ["$status","present"]}, 1, 0]}}}},
        {"$sort": {"_id": 1}},
        {"$limit": 30}
    ]
    monthly_attendance = await db.attendance.aggregate(monthly_pipeline).to_list(None)

    return {
        "total_employees": total,
        "active": active,
        "on_leave": on_leave,
        "inactive": inactive,
        "department_breakdown": [{"department": d["_id"], "count": d["count"]} for d in dept_breakdown],
        "today_attendance": {"present": today_present, "absent": today_absent},
        "monthly_attendance": monthly_attendance
    }

@router.get("/performance")
async def performance_stats(db=Depends(get_db), current_user=Depends(get_current_user)):
    pipeline = [
        {"$group": {
            "_id": "$department",
            "avg_salary": {"$avg": "$salary"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"avg_salary": -1}}
    ]
    data = await db.employees.aggregate(pipeline).to_list(None)
    return {"performance_by_department": data}

@router.get("/trends")
async def get_trends(db = Depends(get_db), current_user = Depends(get_current_user)):
    now = datetime.now(timezone.utc)

    def calc_trend(current, previous):
        if previous == 0:
            return 0
        return round(((current - previous) / previous) * 100, 1)

    # This month vs last month
    this_month_start = now.replace(day=1, hour=0, minute=0, second=0)
    last_month_start = (this_month_start - timedelta(days=1)).replace(day=1)
    
    # Today vs yesterday
    today = now.strftime("%Y-%m-%d")
    yesterday = (now - timedelta(days=1)).strftime("%Y-%m-%d")
    
    # This week vs last week
    this_week_start = (now - timedelta(days=now.weekday())).strftime("%Y-%m-%d")
    last_week_start = (now - timedelta(days=now.weekday() + 7)).strftime("%Y-%m-%d")
    last_week_end = (now - timedelta(days=now.weekday() + 1)).strftime("%Y-%m-%d")

    this_month_emp = await db.employees.count_documents({
        "date_of_joining": {"$gte": this_month_start.strftime("%Y-%m-%d")}
    })

    last_month_emp = await db.employees.count_documents({
        "date_of_joining": {
            "$gte": last_month_start.strftime("%Y-%m-%d"),
            "$lt": this_month_start.strftime("%Y-%m-%d")
        }
    })

    today_present = await db.attendance.count_documents({
        "date": today,
        "status": "present"
    })

    yesterday_present = await db.attendance.count_documents({
        "date": yesterday,
        "status": "present"
    })

    current_on_leave = await db.employees.count_documents({
        "status" : "on_leave"
    })

    current_inactive = await db.employees.count_documents({
        "status" : "inactive"
    })

    return {
        "employees": calc_trend(this_month_emp, last_month_emp),
        "present": calc_trend(today_present, yesterday_present),
        "on_leave": calc_trend(current_on_leave, 0),
        "inactive": calc_trend(current_inactive, 0)
    }