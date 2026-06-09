import { useState, useEffect } from "react"
import { Check, X, Clock, Wifi } from "lucide-react"
import api from "../api"

const STATUS_META = {
  present: { icon: Check, bg: "#10b98118", color: "#10b981", label: "Present" },
  absent: { icon: X, bg: "#ef444418", color: "#ef4444", label: "Absent" },
  late: { icon: Clock, bg: "#f59e0b18", color: "#f59e0b", label: "Late" },
  remote: { icon: Wifi, bg: "#6366f118", color: "#6366f1", label: "Remote" },
}

export default function AttendancePage() {
  const [form, setForm] = useState({ employee_id: "", status: "present", check_in: "", check_out: "" })
  const [msg, setMsg] = useState({ text: "", type: "" })
  const [records, setRecords] = useState([])
  const [lookupId, setLookupId] = useState("")
  const handleMark = async (e) => {
    e.preventDefault()
    try {
      await api.post("/attendance/", {
        ...form,
        date: new Date().toISOString().split("T")[0]
      })
      setMsg({ text: "Attendance marked successfully!", type: "success" })
      setTimeout(() => setMsg({ text: "", type: "" }), 3000)
      setForm({ employee_id: "", status: "present", check_in: "", check_out: "" })
    } catch (err) {
      setMsg({ text: err.response?.data?.detail || "Failed to mark attendance", type: "error" })
    }
  }

  const handleLookup = async (e) => {
    e.preventDefault()
    try {
      const res = await api.get(`/attendance/${lookupId}`)
      setRecords(res.data.records || [])
    } catch (err) { console.error(err) }
  }
  const role = localStorage.getItem("ems_role")
  const isHR = role === "Admin" || role === "H.R."
  const myEmpId = localStorage.getItem("ems_employee_id")

  useEffect(() => {
      if (role === "Employee" && myEmpId) {
          // auto lookup their own records
          api.get(`/attendance/${myEmpId}`).then(r => setRecords(r.data.records || []))
      }
  }, [])


  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg: #0d0f14; --surface: #13161e; --surface2: #1a1e2a; --border: #ffffff0f; --border2: #ffffff1a; --text: #e8eaf0; --muted: #6b7280; --accent: #6366f1; --green: #10b981; --red: #ef4444; }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .page { padding: 28px; }
        .page-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 4px; }
        .page-sub { font-size: 13px; color: var(--muted); margin-bottom: 24px; }
        .grid { display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: start; }
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .card-header { padding: 18px 20px; border-bottom: 1px solid var(--border); font-family: 'Syne', sans-serif; font-weight: 600; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 11px 20px; font-size: 11px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; background: var(--surface2); }
        td { padding: 13px 20px; font-size: 13.5px; border-top: 1px solid var(--border); }
        .status-chip { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 99px; font-size: 12px; font-weight: 500; }
        .form-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 20px; }
        .form-title { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 14px; margin-bottom: 16px; }
        .field { margin-bottom: 14px; }
        .field label { display: block; font-size: 12px; color: var(--muted); margin-bottom: 6px; }
        .field input, .field select { width: 100%; background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px; padding: 10px 12px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13.5px; outline: none; transition: border-color 0.2s; }
        .field input:focus, .field select:focus { border-color: var(--accent); }
        .field input::placeholder { color: var(--muted); }
        .submit-btn { width: 100%; background: var(--accent); border: none; border-radius: 10px; color: white; font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 500; padding: 11px; cursor: pointer; transition: opacity 0.2s; margin-top: 4px; }
        .submit-btn:hover { opacity: 0.88; }
        .msg { font-size: 13px; border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; }
        .msg.success { background: #10b98114; border: 1px solid #10b98130; color: var(--green); }
        .msg.error { background: #ef444414; border: 1px solid #ef444430; color: var(--red); }
        .lookup-row { display: flex; gap: 8px; margin-bottom: 16px; }
        .lookup-row input { flex: 1; background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px; padding: 9px 12px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; }
        .lookup-btn { background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px; color: var(--text); padding: 9px 14px; font-size: 13px; cursor: pointer; white-space: nowrap; }
        .empty { text-align: center; padding: 32px; color: var(--muted); font-size: 13px; }
      `}</style>

      <div className="page">
        <div className="page-title">Attendance</div>
        <div className="page-sub">{today}</div>

        <div className="grid">
          <div>
            {isHR && (<form onSubmit={handleLookup} style={{ marginBottom: 16 }}>
              <div className="lookup-row">
                <input placeholder="Lookup by Employee ID (e.g. EMP0001)"
                  value={lookupId} onChange={e => setLookupId(e.target.value)} />
                <button type="submit" className="lookup-btn">Look up</button>
              </div>
            </form>)}
            <div className="card">
              <div className="card-header">Attendance Records</div>
              {records.length === 0 ? (
                <div className="empty">Enter an employee ID above to view records</div>
              ) : (
                <table>
                  <thead>
                    <tr><th>Date</th><th>Status</th><th>Check In</th><th>Check Out</th></tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) => {
                      const meta = STATUS_META[r.status] || STATUS_META.present
                      const Icon = meta.icon
                      return (
                        <tr key={i}>
                          <td>{r.date}</td>
                          <td><span className="status-chip" style={{ background: meta.bg, color: meta.color }}><Icon size={11} />{meta.label}</span></td>
                          <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.check_in || "—"}</td>
                          <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.check_out || "—"}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          
          {(isHR && <div className="form-card">
            <div className="form-title">Mark Attendance</div>
            {msg.text && <div className={`msg ${msg.type}`}>{msg.text}</div>}
            <form onSubmit={handleMark}>
              <div className="field"><label>Employee ID</label><input placeholder="EMP0001" value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))} required /></div>
              <div className="field">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="remote">Remote</option>
                  <option value="half_day">Half Day</option>
                </select>
              </div>
              <div className="field"><label>Check In</label><input type="time" value={form.check_in} onChange={e => setForm(f => ({ ...f, check_in: e.target.value }))} /></div>
              <div className="field"><label>Check Out</label><input type="time" value={form.check_out} onChange={e => setForm(f => ({ ...f, check_out: e.target.value }))} /></div>
              <button type="submit" className="submit-btn">Mark Attendance</button>
            </form>
          </div>)}
        </div>
      </div>
    </>
  )
}