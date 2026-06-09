import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./components/LoginPage"
import DashboardPage from "./components/DashboardPage"
import EmployeesPage from "./components/EmployeesPage"
import AttendancePage from "./components/AttendancePage"
import DepartmentsPage from "./components/DepartmentsPage"
import AIInsightsPage from "./components/AiinsightsPage"
import Layout from "./components/Layout"
function PrivateRoute({ children }) {
  const token = localStorage.getItem("ems_token")
  return token ? children : <Navigate to="/login" replace />
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="ai-insights" element={<AIInsightsPage />} />
          <Route index element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}