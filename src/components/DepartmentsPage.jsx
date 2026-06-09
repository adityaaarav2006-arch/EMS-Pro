import { useState, useEffect } from "react"
import { Building2, Users, Plus, Trash2 } from "lucide-react"
import api from "../api"

const ACCENTS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"]

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", description: "" })
  const role = localStorage.getItem("ems_role")
  const isAdmin = role === "Admin"

  useEffect(() => {
    api.get("/departments/").then(r => setDepartments(r.data)).catch(console.error)
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/departments/?name=${encodeURIComponent(form.name)}&description=${encodeURIComponent(form.description)}`)
      const res = await api.get("/departments/")
      setDepartments(res.data)
      setShowForm(false)
      setForm({ name: "", description: "" })
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (name) => {
    try {
      await api.delete(`/departments/${encodeURIComponent(name)}`)
      setDepartments(d => d.filter(x => x.name !== name))
    } catch (err) { console.error(err) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg: #0d0f14; --surface: #13161e; --surface2: #1a1e2a; --border: #ffffff0f; --border2: #ffffff1a; --text: #e8eaf0; --muted: #6b7280; --accent: #6366f1; --red: #ef4444; }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .page { padding: 28px; }
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .page-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; }
        .page-sub { font-size: 13px; color: var(--muted); margin-top: 3px; }
        .btn { display: flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: opacity 0.2s; }
        .btn-primary { background: var(--accent); color: white; }
        .btn:hover { opacity: 0.85; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .dept-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 22px; transition: border-color 0.2s; position: relative; overflow: hidden; }
        .dept-card:hover { border-color: var(--border2); }
        .dept-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
        .dept-name { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 600; margin-bottom: 6px; }
        .dept-desc { font-size: 13px; color: var(--muted); line-height: 1.5; margin-bottom: 16px; }
        .dept-footer { display: flex; align-items: center; justify-content: space-between; }
        .dept-count { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); }
        .delete-btn { background: none; border: none; color: var(--muted); cursor: pointer; display: flex; align-items: center; transition: color 0.15s; padding: 4px; border-radius: 6px; }
        .delete-btn:hover { color: var(--red); background: #ef444412; }
        .modal-overlay { position: fixed; inset: 0; background: #00000088; display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal { background: var(--surface); border: 1px solid var(--border2); border-radius: 18px; padding: 28px; width: 100%; max-width: 400px; }
        .modal-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 20px; }
        .field { margin-bottom: 14px; }
        .field label { display: block; font-size: 12px; color: var(--muted); margin-bottom: 6px; }
        .field input, .field textarea { width: 100%; background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px; padding: 10px 12px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13.5px; outline: none; resize: none; transition: border-color 0.2s; }
        .field input:focus, .field textarea:focus { border-color: var(--accent); }
        .field input::placeholder, .field textarea::placeholder { color: var(--muted); }
        .modal-actions { display: flex; gap: 10px; margin-top: 6px; }
        .btn-cancel { background: var(--surface2); border: 1px solid var(--border2); color: var(--text); flex: 1; justify-content: center; }
        .btn-submit { background: var(--accent); color: white; flex: 1; justify-content: center; }
        .empty { text-align: center; padding: 48px; color: var(--muted); }
      `}</style>

      <div className="page">
        <div className="page-header">
          <div>
            <div className="page-title">Departments</div>
            <div className="page-sub">{departments.length} departments</div>
          </div>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={14} /> New Department
            </button>
          )}
        </div>

        {departments.length === 0 ? (
          <div className="empty">No departments found</div>
        ) : (
          <div className="grid">
            {departments.map((dept, i) => {
              const accent = ACCENTS[i % ACCENTS.length]
              return (
                <div key={dept.id} className="dept-card">
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent, borderRadius: "16px 16px 0 0" }} />
                  <div className="dept-icon" style={{ background: accent + "18" }}>
                    <Building2 size={20} color={accent} />
                  </div>
                  <div className="dept-name">{dept.name}</div>
                  <div className="dept-desc">{dept.description || "No description"}</div>
                  <div className="dept-footer">
                    <div className="dept-count"><Users size={14} />{dept.employee_count || 0} employees</div>
                    {isAdmin && (
                      <button className="delete-btn" onClick={() => handleDelete(dept.name)}>
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">New Department</div>
            <form onSubmit={handleCreate}>
              <div className="field"><label>Name</label><input placeholder="e.g. Engineering" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
              <div className="field"><label>Description</label><textarea rows={3} placeholder="What does this department do?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-submit">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}