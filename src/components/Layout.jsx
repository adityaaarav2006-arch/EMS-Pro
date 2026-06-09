import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Clock, Building2,
  Sparkles, LogOut, Menu, X
} from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Employees", path: "/employees" },
  { icon: Clock, label: "Attendance", path: "/attendance" },
  { icon: Building2, label: "Departments", path: "/departments" },
  { icon: Sparkles, label: "AI Insights", path: "/ai-insights" },
];

export default function Layout() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0d0f14; --surface: #13161e; --surface2: #1a1e2a;
          --border: #ffffff0f; --border2: #ffffff1a;
          --text: #e8eaf0; --muted: #6b7280;
          --accent: #6366f1; --accent2: #22d3ee; --red: #ef4444;
        }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .layout { display: flex; height: 100vh; overflow: hidden; }

        .sidebar {
          width: ${open ? "220px" : "64px"};
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          transition: width 0.25s ease;
          flex-shrink: 0; overflow: hidden;
        }

        .sidebar-logo {
          display: flex; align-items: center; gap: 10px;
          padding: 16px; border-bottom: 1px solid var(--border);
          min-height: 64px; position: relative;
        }

        .logo-mark {
          width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px; color: white;
        }

        .logo-text {
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px;
          white-space: nowrap;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          opacity: ${open ? 1 : 0}; transition: opacity 0.2s;
        }

        .toggle-btn {
          margin-left: auto; flex-shrink: 0;
          background: var(--surface2); border: 1px solid var(--border2);
          color: var(--muted); border-radius: 6px;
          width: 26px; height: 26px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.15s;
        }
        .toggle-btn:hover { color: var(--text); }

        .sidebar-nav { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }

        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px; border-radius: 10px;
          background: none; border: none; color: var(--muted);
          font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 500;
          cursor: pointer; width: 100%; text-align: left; white-space: nowrap;
          transition: background 0.15s, color 0.15s; position: relative;
        }
        .nav-item:hover { background: var(--surface2); color: var(--text); }
        .nav-item.active { color: var(--accent); background: #6366f112; }
        .nav-item.active::before {
          content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 3px; border-radius: 0 3px 3px 0; background: var(--accent);
        }
        .nav-item span { opacity: ${open ? 1 : 0}; transition: opacity 0.15s; white-space : nowrap; }

        .sidebar-footer { padding: 10px 8px; border-top: 1px solid var(--border); }

        .user-chip { display: flex; align-items: center; gap: 10px; padding: 8px 10px; margin-bottom: 4px; }
        .user-avatar {
          width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: white;
        }
        .user-info { overflow: hidden; opacity: ${open ? 1 : 0}; transition: opacity 0.2s; }
        .user-name { font-size: 13px; font-weight: 500; white-space: nowrap; }
        .user-role { font-size: 11px; color: var(--muted); }

        .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

        .topbar {
          height: 64px; background: var(--surface);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center;
          padding: 0 24px; flex-shrink: 0;
        }
        .topbar-title {
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 600;
        }

        .content { flex: 1; overflow-y: auto; background: var(--bg); }
      `}</style>

      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">E</div>
            <span className="logo-text">EMS Pro</span>
          </div>
            <button className="toggle-btn" onClick={() => setOpen(o => !o)}>
              {open ? <X size={13} /> : <Menu size={13} />}
            </button>
          <nav className="sidebar-nav">
            {NAV.map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                className={`nav-item ${location.pathname === path ? "active" : ""}`}
                onClick={() => navigate(path)}
              >
                <Icon size={18} style = {{ flexShrink : 0}}/>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="user-avatar">A</div>
              <div className="user-info">
                <div className="user-name">Admin User</div>
                <div className="user-role">HR Admin</div>
              </div>
            </div>
            <button className="nav-item" style={{ color: "var(--red)" }}
              onClick={() => navigate("/login")}>
              <LogOut size={18} style = {{flexShrink : 0}}/>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <header className="topbar">
            <span className="topbar-title">
              {NAV.find(n => n.path === location.pathname)?.label || "EMS Pro"}
            </span>
          </header>
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}