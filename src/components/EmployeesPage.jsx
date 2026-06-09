import { useState, useEffect } from "react"
import { Search, Plus, Download, ChevronRight } from "lucide-react"
import api from "../api"

const STATUS_COLOR = {
  active: { bg: "#10b98118", color: "#10b981" },
  on_leave: { bg: "#f59e0b18", color: "#f59e0b" },
  inactive: { bg: "#ef444418", color: "#ef4444" },
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const role = localStorage.getItem("ems_role")
  const isHR = role === "Admin" || role === "H.R."

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees/")
      setEmployees(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const res = await api.get("/employees/export/csv", { responseType: "blob" })
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement("a")
      a.href = url; a.download = "employees.csv"; a.click()
    } catch (err) { console.error(err) }
  }

  const filtered = employees.filter(e => {
    const matchSearch = !search ||
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.department?.toLowerCase().includes(search.toLowerCase()) ||
      e.employee_id?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || e.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg: #0d0f14; --surface: #13161e; --surface2: #1a1e2a; --border: #ffffff0f; --border2: #ffffff1a; --text: #e8eaf0; --muted: #6b7280; --accent: #6366f1; }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .page { padding: 28px; }
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .page-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; }
        .page-sub { font-size: 13px; color: var(--muted); margin-top: 3px; }
        .header-actions { display: flex; gap: 10px; }
        .btn { display: flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: opacity 0.2s; }
        .btn:hover { opacity: 0.85; }
        .btn-primary { background: var(--accent); color: white; }
        .btn-secondary { background: var(--surface2); border: 1px solid var(--border2); color: var(--text); }
        .filters { display: flex; gap: 12px; margin-bottom: 18px; }
        .search-wrap { flex: 1; max-width: 360px; display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border2); border-radius: 10px; padding: 0 14px; height: 40px; }
        .search-wrap input { background: none; border: none; outline: none; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13.5px; width: 100%; }
        .search-wrap input::placeholder { color: var(--muted); }
        .filter-select { background: var(--surface); border: 1px solid var(--border2); border-radius: 10px; padding: 0 14px; height: 40px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; cursor: pointer; }
        .table-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        thead { background: var(--surface2); }
        th { text-align: left; padding: 12px 18px; font-size: 11px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }
        td { padding: 14px 18px; font-size: 13.5px; border-top: 1px solid var(--border); }
        tr:hover td { background: var(--surface2); cursor: pointer; }
        .status-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 99px; font-size: 12px; font-weight: 500; }
        .empty { text-align: center; padding: 48px; color: var(--muted); font-size: 14px; }
      `}</style>

      <div className="page">
        <div className="page-header">
          <div>
            <div className="page-title">Employees</div>
            <div className="page-sub">{filtered.length} records</div>
          </div>
          {isHR && (
            <div className="header-actions">
              <button className="btn btn-secondary" onClick={handleExport}><Download size={14} /> Export CSV</button>
              <button className="btn btn-primary"><Plus size={14} /> Add Employee</button>
            </div>
          )}
        </div>

        <div className="filters">
          <div className="search-wrap">
            <Search size={15} color="var(--muted)" />
            <input placeholder="Search by name, ID, department..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="table-card">
          {loading ? (
            <div className="empty">Loading employees...</div>
          ) : filtered.length === 0 ? (
            <div className="empty">No employees found</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Employee</th><th>ID</th><th>Department</th><th>Designation</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => {
                  const s = STATUS_COLOR[emp.status] || STATUS_COLOR.inactive
                  return (
                    <tr key={emp.employee_id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{emp.name}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>{emp.email}</div>
                      </td>
                      <td><span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{emp.employee_id}</span></td>
                      <td>{emp.department}</td>
                      <td>{emp.designation}</td>
                      <td><span className="status-badge" style={{ background: s.bg, color: s.color }}>{emp.status?.replace("_", " ")}</span></td>
                      <td style={{ color: "var(--muted)" }}><ChevronRight size={16} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}