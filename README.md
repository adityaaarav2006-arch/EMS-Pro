# EMS Pro — AI-Powered Employee Management System

A full-stack Employee Management System with AI-powered insights, built as an internship assignment at Genovation Technological Solutions Pvt. Ltd.

---

## Tech Stack

**Backend**
- Python + FastAPI
- MongoDB + Motor (async driver)
- JWT Authentication (python-jose + bcrypt)
- Google Gemini AI (google-genai)

**Frontend**
- React + Vite
- Tailwind CSS
- Recharts (data visualization)
- Axios

---

## Project Structure

```
ems-project/
├── ems-backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── core/
│   │   │   ├── security.py       # JWT + bcrypt
│   │   │   └── dependencies.py   # Auth dependencies, role guards
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── employees.py
│   │   │   ├── departments.py
│   │   │   ├── attendance.py
│   │   │   ├── analytics.py
│   │   │   └── ai_insights.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   └── employee.py
│   │   └── services/
│   │       └── ai_service.py     # Gemini AI integration
│   ├── requirements.txt
│   └── .env.example
│
└── ems-frontend/
    └── src/
        ├── components/
        │   ├── Layout.jsx
        │   ├── LoginPage.jsx
        │   ├── DashboardPage.jsx
        │   ├── EmployeesPage.jsx
        │   ├── AttendancePage.jsx
        │   ├── DepartmentsPage.jsx
        │   └── AIInsightsPage.jsx
        ├── api.js
        └── App.jsx
```

---

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key (from [aistudio.google.com](https://aistudio.google.com))

### Backend

```bash
cd ems-backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Fill in `.env`:
```
MONGODB_URL=mongodb://localhost:27017
DB_NAME=ems_db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY=your-gemini-api-key
CORS_ORIGIN=http://localhost:5173
```

```bash
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`  
API docs: `http://localhost:8000/docs`

### Frontend

```bash
cd ems-frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Create First Admin User

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@company.com","password":"admin123","role":"Admin"}'
```

---

## API Documentation

Full interactive documentation available at `http://localhost:8000/docs`

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login, returns JWT token | No |
| GET | /auth/me | Get current user info | Yes |

### Employees
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | /employees/ | List all employees | Any |
| POST | /employees/ | Create employee | Admin, H.R. |
| GET | /employees/{id} | Get employee by ID | Any |
| PATCH | /employees/{id} | Update employee | Admin, H.R. |
| DELETE | /employees/{id} | Delete employee | Admin |
| GET | /employees/export/csv | Export CSV | Admin, H.R. |

### Departments
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | /departments/ | List all departments | Any |
| POST | /departments/ | Create department | Admin |
| DELETE | /departments/{name} | Delete department | Admin |

### Attendance
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| POST | /attendance/ | Mark attendance | Admin, H.R. |
| GET | /attendance/{emp_id} | Get attendance records | Any |
| GET | /attendance/summary/{emp_id} | Yearly summary | Any |

### Analytics
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | /analytics/dashboard | Dashboard stats | Any |
| GET | /analytics/performance | Performance by dept | Any |
| GET | /analytics/trends | Trend percentages | Any |

### AI Insights
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | /ai/summary/{emp_id} | AI profile summary | Admin, H.R. |
| GET | /ai/performance-insights | Performance insights | Admin, H.R. |
| POST | /ai/search | Natural language search | Any |
| GET | /ai/hr-report | Automated HR report | Admin, H.R. |

---

## Database Schema

### users
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "hashed_password": "string",
  "role": "Admin | H.R. | Employee",
  "created_at": "datetime"
}
```

### employees
```json
{
  "_id": "ObjectId",
  "employee_id": "string (EMP0001 format, unique)",
  "name": "string",
  "email": "string (unique)",
  "phone": "string",
  "department": "string",
  "designation": "string",
  "date_of_joining": "YYYY-MM-DD",
  "status": "active | inactive | on_leave",
  "salary": "float",
  "skills": ["string"]
}
```

### attendance
```json
{
  "_id": "ObjectId",
  "employee_id": "string",
  "date": "YYYY-MM-DD",
  "status": "present | absent | late | remote | half_day",
  "check_in": "HH:MM",
  "check_out": "HH:MM",
  "created_at": "datetime"
}
```

### departments
```json
{
  "_id": "ObjectId",
  "name": "string (unique)",
  "description": "string",
  "created_at": "datetime"
}
```

---

## AI Integration

All AI features use the **Google Gemini 2.5 Flash** model via the `google-genai` Python package.

### Features

**1. Employee Profile Summary**  
Generates a 3-4 sentence professional HR summary for an employee based on their profile and attendance data.

**2. Performance Insights**  
Analyzes all active employees and provides workforce assessment, department observations, and actionable HR recommendations.

**3. Natural Language Search**  
Accepts plain English queries like "Show me all senior engineers on leave" and returns matching employees using Gemini to interpret intent.

**4. Automated HR Report**  
Generates a formal HR report with executive summary, workforce overview, key observations, and recommendations based on live analytics data.

---

## Roles & Permissions

| Feature | Employee | H.R. | Admin |
|---------|----------|------|-------|
| View employees | ✅ | ✅ | ✅ |
| Add/Edit employees | ❌ | ✅ | ✅ |
| Delete employees | ❌ | ❌ | ✅ |
| Mark attendance | ❌ | ✅ | ✅ |
| View own attendance | ✅ | ✅ | ✅ |
| Create departments | ❌ | ❌ | ✅ |
| View AI insights | ❌ | ✅ | ✅ |
| Export CSV | ❌ | ✅ | ✅ |
| Dashboard analytics | ✅ | ✅ | ✅ |

---

## Future Enhancements

- Role-based dashboard — employees see personal stats, HR/Admin see company-wide analytics
- Employee profile page with edit functionality
- Leave management module
- Payroll integration
- Real-time notifications
- Docker deployment
- Unit and integration tests

---

## Author

Aditya Jaiswal  
B.Tech CSE, VIT Vellore (2024–2028)  
