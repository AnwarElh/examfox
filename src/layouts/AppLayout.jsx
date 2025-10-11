import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200 p-4 hidden md:flex md:flex-col">
        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          ExamFox
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/app"
            end
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 font-medium transition ${
                isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            Reader
          </NavLink>
          <NavLink
            to="testing"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 font-medium transition ${
                isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            Testing Hub
          </NavLink>
          <NavLink
            to="creative"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 font-medium transition ${
                isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            Creative Tools
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-semibold text-slate-900">Dashboard</h1>
          <div className="text-slate-500 text-sm">Welcome back</div>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
