import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", password: "" })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(""); setLoading(true)
    try {
      const formData = new FormData()
      formData.append("username", form.username)
      formData.append("password", form.password)
      const res = await axios.post("http://localhost:8000/auth/login", formData)
      localStorage.setItem("ems_token", res.data.access_token)
      localStorage.setItem("ems_role", res.data.role)
      localStorage.setItem("ems_name", res.data.name)
      localStorage.setItem("ems_employee_id", res.data.employee_id || "")
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0d0f14; --surface: #13161e; --surface2: #1a1e2a;
          --border: #ffffff0f; --border2: #ffffff1a;
          --text: #e8eaf0; --muted: #6b7280; --accent: #6366f1; --accent2: #22d3ee; --red: #ef4444;
        }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }
        .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; position: relative; overflow: hidden; }
        .login-page::before { content: ''; position: fixed; top: -200px; left: -200px; width: 600px; height: 600px; background: radial-gradient(circle, #6366f130 0%, transparent 70%); pointer-events: none; }
        .login-page::after { content: ''; position: fixed; bottom: -200px; right: -100px; width: 500px; height: 500px; background: radial-gradient(circle, #22d3ee18 0%, transparent 70%); pointer-events: none; }
        .login-card { width: 100%; max-width: 420px; background: var(--surface); border: 1px solid var(--border2); border-radius: 20px; padding: 40px; position: relative; z-index: 1; }
        .login-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
        .brand-mark { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; color: white; }
        .brand-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px; background: linear-gradient(90deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .login-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 6px; }
        .login-sub { font-size: 14px; color: var(--muted); margin-bottom: 28px; }
        .error-box { background: #ef444412; border: 1px solid #ef444430; color: #ef4444; font-size: 13px; border-radius: 10px; padding: 10px 14px; margin-bottom: 18px; }
        .field { margin-bottom: 16px; }
        .field label { display: block; font-size: 13px; font-weight: 500; color: var(--muted); margin-bottom: 6px; }
        .input-wrap { position: relative; }
        .input-wrap input { width: 100%; background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px; padding: 11px 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .input-wrap input:focus { border-color: var(--accent); }
        .input-wrap input::placeholder { color: var(--muted); }
        .pass-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--muted); cursor: pointer; display: flex; align-items: center; transition: color 0.15s; }
        .pass-toggle:hover { color: var(--text); }
        .login-btn { width: 100%; background: linear-gradient(135deg, var(--accent), #818cf8); border: none; border-radius: 10px; color: white; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; padding: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px; transition: opacity 0.2s; }
        .login-btn:hover { opacity: 0.9; }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-footer { text-align: center; font-size: 12px; color: var(--muted); margin-top: 24px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-brand">
            <div className="brand-mark">E</div>
            <span className="brand-name">EMS Pro</span>
          </div>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-sub">Sign in to your HR dashboard</p>
          {error && <div className="error-box">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email address</label>
              <div className="input-wrap">
                <input type="email" placeholder="admin@company.com"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
              </div>
            </div>
            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <input type={showPass ? "text" : "password"} placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ paddingRight: 40 }} required />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading && <Loader2 size={15} className="spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="login-footer">Employee Management System &copy; {new Date().getFullYear()}</div>
        </div>
      </div>
    </>
  )
}