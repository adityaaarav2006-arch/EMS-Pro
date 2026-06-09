from google import genai
from app.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def generate_employee_summary(employee: dict, attendance_summary: dict = {}) -> str:
    prompt = f"""
    Generate a professional HR profile summary for this employee:
    Name: {employee.get('name')}
    Department: {employee.get('department')}
    Designation: {employee.get('designation')}
    Status: {employee.get('status')}
    Skills: {', '.join(employee.get('skills', []))}
    Date of Joining: {employee.get('date_of_joining')}
    Write a 3-4 sentence professional summary.
    """
    response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    return response.text

async def generate_performance_insights(employees: list) -> str:
    summary = "\n".join([
        f"- {e.get('name')} | {e.get('department')} | {e.get('designation')} | {e.get('status')}"
        for e in employees[:20]
    ])
    prompt = f"""
    Analyze this employee data and provide HR insights:
    {summary}
    Provide:
    1. Overall workforce assessment
    2. Department observations
    3. 3 actionable HR recommendations
    Keep it under 300 words.
    """
    response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    return response.text

async def natural_language_search(query: str, employees: list) -> list:
    emp_list = "\n".join([
        f"ID:{e.get('employee_id')} Name:{e.get('name')} Dept:{e.get('department')} Status:{e.get('status')}"
        for e in employees[:50]
    ])
    prompt = f"""
    Query: "{query}"
    Employees:
    {emp_list}
    Return ONLY a JSON array of matching employee_id strings. Example: ["EMP0001", "EMP0002"]
    If none match return [].
    """
    response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    import json, re
    match = re.search(r'\[.*?\]', response.text, re.DOTALL)
    if match:
        return json.loads(match.group())
    return []

async def generate_hr_report(stats: dict) -> str:
    prompt = f"""
    Generate a formal HR report based on:
    - Total Employees: {stats.get('total_employees')}
    - Active: {stats.get('active')}
    - On Leave: {stats.get('on_leave')}
    - Inactive: {stats.get('inactive')}
    - Department Breakdown: {stats.get('department_breakdown')}
    Include: Executive Summary, Workforce Overview, Key Observations, Recommendations.
    Keep it under 400 words.
    """
    response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    return response.text