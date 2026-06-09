import { useState } from "react"
import { Sparkles, Search, FileText, TrendingUp, Loader2, Send } from "lucide-react"
import api from "../api"

export default function AIInsightsPage() {
  const [nlQuery, setNlQuery] = useState("")
  const [nlResults, setNlResults] = useState(null)
  const [nlLoading, setNlLoading] = useState(false)
  const [insights, setInsights] = useState("")
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [report, setReport] = useState("")
  const [reportLoading, setReportLoading] = useState(false)

  const handleNLSearch = async (e) => {
    e.preventDefault()
    if (!nlQuery.trim()) return
    setNlLoading(true)
    try {
      const res = await api.post("/ai/search", { query: nlQuery })
      setNlResults(res.data.results)
    } catch (err) { console.error(err) }
    finally { setNlLoading(false) }
  }

  const loadInsights = async () => {
    setInsightsLoading(true)
    try {
      const res = await api.get("/ai/performance-insights")
      setInsights(res.data.insights)
    } catch (err) { console.error(err) }
    finally { setInsightsLoading(false) }
  }

  const loadReport = async () => {
    setReportLoading(true)
    try {
      const res = await api.get("/ai/hr-report")
      setReport(res.data.report)
    } catch (err) { console.error(err) }
    finally { setReportLoading(false) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg: #0d0f14; --surface: #13161e; --surface2: #1a1e2a; --border: #ffffff0f; --border2: #ffffff1a; --text: #e8eaf0; --muted: #6b7280; --accent: #6366f1; --accent2: #22d3ee; }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .page { padding: 28px; max-width: 860px; }
        .page-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
        .page-sub { font-size: 13px; color: var(--muted); margin-bottom: 24px; }
        .accent-dot { width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .ai-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 22px; margin-bottom: 16px; }
        .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .card-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .card-desc { font-size: 13px; color: var(--muted); margin-bottom: 16px; }
        .search-row { display: flex; gap: 10px; }
        .search-input { flex: 1; background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px; padding: 10px 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13.5px; outline: none; transition: border-color 0.2s; }
        .search-input:focus { border-color: var(--accent); }
        .search-input::placeholder { color: var(--muted); }
        .btn { display: flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: opacity 0.2s; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-accent { background: var(--accent); color: white; }
        .btn-ghost { background: var(--surface2); border: 1px solid var(--border2); color: var(--text); }
        .btn:not(:disabled):hover { opacity: 0.85; }
        .result-box { margin-top: 14px; background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px; padding: 14px; font-size: 13px; white-space: pre-wrap; line-height: 1.7; color: var(--text); }
        .empty-state { text-align: center; padding: 16px; color: var(--muted); font-size: 13px; }
        .result-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); }
        .result-row:last-child { border: none; }
        .gemini-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: var(--muted); background: var(--surface2); border: 1px solid var(--border2); padding: 3px 8px; border-radius: 6px; }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="page">
        <div className="page-title"><Sparkles size={22} color="#6366f1" /> AI Insights <div className="accent-dot" /></div>
        <div className="page-sub">Powered by Google Gemini · Natural language HR intelligence</div>

        <div className="ai-card">
          <div className="card-header">
            <div className="card-title"><Search size={15} color="#6366f1" /> Natural Language Search</div>
            <span className="gemini-badge"><Sparkles size={10} /> Gemini</span>
          </div>
          <div className="card-desc">Ask in plain English — "Show me all senior engineers on leave" or "Find employees in Finance"</div>
          <form onSubmit={handleNLSearch}>
            <div className="search-row">
              <input className="search-input" value={nlQuery} onChange={e => setNlQuery(e.target.value)} placeholder="Find employees who joined this year in Engineering..." />
              <button type="submit" className="btn btn-accent" disabled={nlLoading}>
                {nlLoading ? <Loader2 size={14} className="spin" /> : <Send size={14} />} Search
              </button>
            </div>
          </form>
          {nlResults !== null && (
            <div className="result-box">
              {nlResults.length === 0 ? (
                <div className="empty-state">No matching employees found.</div>
              ) : nlResults.map(emp => (
                <div key={emp.employee_id} className="result-row">
                  <div>
                    <div style={{ fontWeight: 500 }}>{emp.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{emp.department} · {emp.designation}</div>
                  </div>
                  <span style={{ fontSize: 12, color: "#10b981" }}>{emp.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ai-card">
          <div className="card-header">
            <div className="card-title"><TrendingUp size={15} color="#22d3ee" /> Performance Insights</div>
            <button className="btn btn-ghost" onClick={loadInsights} disabled={insightsLoading} style={{ fontSize: 12, padding: "6px 12px" }}>
              {insightsLoading ? <Loader2 size={12} className="spin" /> : <Sparkles size={12} />} Generate
            </button>
          </div>
          <div className="card-desc">AI-powered analysis of team performance and actionable HR recommendations.</div>
          {insightsLoading && <div className="empty-state">Gemini is analyzing your workforce...</div>}
          {insights && <div className="result-box">{insights}</div>}
        </div>

        <div className="ai-card">
          <div className="card-header">
            <div className="card-title"><FileText size={15} color="#f59e0b" /> Automated HR Report</div>
            <button className="btn btn-ghost" onClick={loadReport} disabled={reportLoading} style={{ fontSize: 12, padding: "6px 12px" }}>
              {reportLoading ? <Loader2 size={12} className="spin" /> : <Sparkles size={12} />} Generate Report
            </button>
          </div>
          <div className="card-desc">Formal HR report generated from live analytics data.</div>
          {reportLoading && <div className="empty-state">Generating your HR report...</div>}
          {report && <div className="result-box">{report}</div>}
        </div>
      </div>
    </>
  )
}