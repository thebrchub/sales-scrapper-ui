import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const NAV = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/campaigns", icon: Megaphone, label: "Campaigns" },
  { to: "/leads", icon: Users, label: "Leads" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/about", icon: BookOpen, label: "About & Guide" },
];

export default function Layout() {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // New state for desktop sidebar

  return (
    // Enforced deep black background for the entire app canvas
    <div className="flex h-screen overflow-hidden bg-black font-sans text-zinc-100">
      
      {/* Desktop Sidebar - Animated Width */}
      <aside 
        className={`hidden md:flex flex-col border-r border-white/10 bg-[#09090b] transition-all duration-300 ease-in-out relative z-20 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/10 p-1.5 rounded-full shadow-lg transition-colors z-30"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Sidebar Header */}
        <div className={`flex items-center h-20 border-b border-white/10 transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-6"}`}>
          {isCollapsed ? (
             // Show just a bold initial when collapsed
             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-start to-accent-end flex items-center justify-center text-black font-extrabold text-xl shadow-lg">
               L
             </div>
          ) : (
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent pb-0.5">
                Leads Generator
              </h1>
              <p className="text-[10px] text-zinc-500 mt-1 tracking-[0.2em] font-bold uppercase">BRC HUB LLP</p>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-1.5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              // 👇 1. Added 'relative', removed the shadow box, kept the gradient
              className={({ isActive }) =>
                `relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-3.5"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-accent-start/15 to-accent-end/10 text-accent-start" 
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                }`
              }
            >
              <item.icon size={20} className={`shrink-0 transition-transform duration-200 group-hover:scale-110`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}

              {/* 👇 2. Custom Premium Tooltip (replaces the old 'title' attribute) */}
              {isCollapsed && (
                <span className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-800 border border-white/10 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="p-3 border-t border-white/10 bg-black/20">
          <button
            onClick={logout}
            // 👇 Added 'relative' and 'group'
            className={`relative flex items-center w-full rounded-xl text-sm font-medium transition-all duration-200 group text-zinc-400 hover:text-red-400 hover:bg-red-500/10 ${
              isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-3.5"
            }`}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span>Logout</span>}

            {/* 👇 Custom Premium Tooltip for Logout */}
            {isCollapsed && (
              <span className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-800 border border-white/10 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar (Glassmorphism) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-16 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent">
          Leads Generator
        </h1>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-zinc-300 hover:text-white transition-colors">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Slide-over Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="absolute left-0 top-16 bottom-0 w-64 bg-[#09090b] border-r border-white/10 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-accent-start/15 to-accent-end/10 text-accent-start border border-accent-start/20"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                    }`
                  }
                >
                  <item.icon size={20} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-white/10">
              <button
                onClick={logout}
                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-black pt-16 md:pt-0 pb-20 md:pb-0">
        {/* Subtle background glow for the main canvas */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-start/5 blur-[150px] rounded-full pointer-events-none z-0" />
        
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto relative z-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav (Glassmorphism) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around px-2 pb-safe border-t border-white/10 bg-black/80 backdrop-blur-xl">
        {NAV.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1.5 py-3 text-[10px] font-medium transition-all duration-200 ${
                isActive ? "text-accent-start -translate-y-1" : "text-zinc-500 hover:text-zinc-300"
              }`
            }
          >
            {/* Grab isActive from NavLink's children render prop */}
            {({ isActive }) => (
              <>
                <item.icon 
                  size={20} 
                  className={isActive ? "drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" : ""} 
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}