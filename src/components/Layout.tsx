import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  BarChart3,
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const NAV = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/campaigns", icon: Megaphone, label: "Campaigns" },
  { to: "/leads", icon: Users, label: "Leads" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/dead-letter", icon: AlertTriangle, label: "Dead Letter" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Layout() {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border-default bg-surface-elevated">
        <div className="p-5 border-b border-border-default">
          <h1 className="text-lg font-bold bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent">
            SalesScrapper
          </h1>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-accent-start/15 to-accent-end/15 text-accent-start"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border-default">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-danger hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b border-border-default bg-surface-elevated/95 backdrop-blur-sm">
        <h1 className="text-base font-bold bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent">
          SalesScrapper
        </h1>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-text-secondary">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Slide-over */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="absolute left-0 top-14 bottom-0 w-60 bg-surface-elevated border-r border-border-default"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="py-4 px-3 space-y-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-accent-start/15 to-accent-end/15 text-accent-start"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-3 border-t border-border-default">
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-danger hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-border-default bg-surface-elevated/95 backdrop-blur-sm">
        {NAV.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-2 text-[10px] transition-colors ${
                isActive ? "text-accent-start" : "text-text-muted"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
