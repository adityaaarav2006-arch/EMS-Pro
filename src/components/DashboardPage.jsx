import { useState, useEffect } from "react"
import { Users, Clock, UserCheck, UserX, ChevronUp, ChevronDown } from "lucide-react"
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import api from "../api"

const PIE_COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#ef4444"]

function StatCard({ label, value, sub, trend, icon: Icon, accent }) {
  const up = trend >= 0
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-label">{label}</span>
        <div className="stat-icon" style={{ background: accent + "22", color: accent }}><Icon size={16} /></div>
      </div>
      <div className="stat-value">{(value || 0).toLocaleString()}</div>
      <div className="stat-footer">
        <span className={`stat-trend ${up ? "up" : "down"}`}>
          {up ? <ChevronUp size={13} /> : <ChevronDown size={13} />}{Math.abs(trend)}%
        </span>
        <span className="stat-sub">{sub}</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [trend, setTrend] = useState({ employees: 0, present: 0, on_leave: 0, inactive: 0 })
  const [error, setError] = useState("")
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    api.get("/analytics/dashboard").then(r => setStats(r.data)).catch(err => {
      setError(err.response?.data?.detail || "Failed to load dashboard data")
    })
    api.get("/analytics/trends").then(r => setTrend(r.data)).catch(() => {})
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  

  const hour = time.getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening"
  const name = localStorage.getItem("ems_name") || "Admin"

  const pieData = stats ? [
    { name: "Active", value: stats.active },
    { name: "On Leave", value: stats.on_leave },
    { name: "Inactive", value: stats.inactive },
    { name: "Present Today", value: stats.today_attendance?.present || 0 },
  ] : []

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg: #0d0f14; --surface: #13161e; --surface2: #1a1e2a; --border: #ffffff0f; --border2: #ffffff18; --text: #e8eaf0; --muted: #6b7280; --accent: #6366f1; --accent2: #22d3ee; --green: #10b981; --amber: #f59e0b; --red: #ef4444; --radius: 14px; }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; transition: border-color 0.2s; }
        .stat-card:hover { border-color: var(--border2); }
        .stat-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .stat-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; margin-bottom: 10px; line-height: 1; }
        .stat-footer { display: flex; align-items: center; gap: 8px; }
        .stat-trend { display: flex; align-items: center; gap: 2px; font-size: 12px; font-weight: 600; border-radius: 6px; padding: 2px 6px; }
        .stat-trend.up { background: #10b98118; color: var(--green); }
        .stat-trend.down { background: #ef444418; color: var(--red); }
        .stat-sub { font-size: 12px; color: var(--muted); }
        .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px; }
        .chart-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
        .chart-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; margin-bottom: 4px; }
        .chart-sub { font-size: 12px; color: var(--muted); margin-bottom: 18px; }
        .bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .dept-list { display: flex; flex-direction: column; gap: 10px; }
        .dept-row { display: flex; align-items: center; gap: 10px; }
        .dept-name { font-size: 13px; width: 100px; flex-shrink: 0; }
        .dept-bar-wrap { flex: 1; height: 6px; background: var(--surface2); border-radius: 99px; overflow: hidden; }
        .dept-bar { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--accent), var(--accent2)); }
        .dept-count { font-size: 12px; color: var(--muted); width: 28px; text-align: right; }
        .greeting { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 4px; }
        .greeting-sub { font-size: 13px; color: var(--muted); }
        .page-header { margin-bottom: 24px; }
        .loading { display: flex; align-items: center; justify-content: center; height: 200px; color: var(--muted); font-size: 14px; }
        @media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .charts-grid, .bottom-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ padding: 24 }}>
        <div className="page-header">
          <div className="greeting">{greeting}, {name} 👋</div>
          <div className="greeting-sub">Here's what's happening at your company today.</div>
        </div>

        {error ? <div className="loading" style={{ color: "var(--red)" }}>{error}</div>
          : !stats ? <div className="loading">Loading dashboard...</div> : (
          <>
            <div className="stats-grid">
              <StatCard label="Total Employees" value={stats.total_employees} sub="all time" trend={trend.employees} icon={Users} accent="#6366f1" />
              <StatCard label="Present Today" value={stats.today_attendance?.present} sub="of active staff" trend={trend.present} icon={UserCheck} accent="#22d3ee" />
              <StatCard label="On Leave" value={stats.on_leave} sub="this week" trend={trend.on_leave} icon={Clock} accent="#f59e0b" />
              <StatCard label="Inactive" value={stats.inactive} sub="needs review" trend={trend.inactive} icon={UserX} accent="#ef4444" />
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-title">Attendance Trend</div>
                <div className="chart-sub">Monthly overview</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={stats.monthly_attendance || []} margin={{ left: -20, right: 4 }}>
                    <defs>
                      <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="_id" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#1a1e2a", border: "1px solid #ffffff18", borderRadius: 8, fontSize: 12 }} />
                    <Area type="monotone" dataKey="present" stroke="#6366f1" strokeWidth={2} fill="url(#gPresent)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <div className="chart-title">Workforce Breakdown</div>
                <div className="chart-sub">Current employee status</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1a1e2a", border: "1px solid #ffffff18", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                  {pieData.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i] }} />
                      {d.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bottom-grid">
              <div className="chart-card">
                <div className="chart-title">Employees by Department</div>
                <div className="chart-sub">Headcount distribution</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats.department_breakdown || []} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip contentStyle={{ background: "#1a1e2a", border: "1px solid #ffffff18", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <div className="chart-title">Department Strength</div>
                <div className="chart-sub">Active headcount per team</div>
                <div className="dept-list" style={{ marginTop: 8 }}>
                  {(stats.department_breakdown || []).map((d) => {
                    const max = Math.max(...(stats.department_breakdown || []).map(x => x.count))
                    return (
                      <div key={d.name} className="dept-row">
                        <span className="dept-name">{d.name}</span>
                        <div className="dept-bar-wrap">
                          <div className="dept-bar" style={{ width: `${(d.count / max) * 100}%` }} />
                        </div>
                        <span className="dept-count">{d.count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}