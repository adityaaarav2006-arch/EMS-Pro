from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.database import connect_db,close_db
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, employees, departments, attendance, analytics
from app.routers import ai_insights

@asynccontextmanager
async def lifespan(app : FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(
    title = "Employee Management System",
    description = "Backend for the Management System",
    lifespan = lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGIN],
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(employees.router)
app.include_router(departments.router)
app.include_router(attendance.router)
app.include_router(analytics.router)
app.include_router(ai_insights.router)




