import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { Loader2, Users, Phone, TrendingUp, AlertTriangle, Activity, Monitor, Clock, Eye, ChevronRight } from "lucide-react";

interface EmployeeStat {
  employee_id: string;
  employee_name: string;
  total_leads: number;
  contacted: number;
  conversions: number;
  overdue_follow_ups: number;
  activity_this_week: number;
}

interface EngagementSummary {
  employee_id: string;
  employee_name: string;
  time_today_minutes: number;
  time_this_week_minutes: number;
  actions_per_hour: number;
  last_seen: string | null;
  idle_days: number;
  status: "online" | "active_today" | "inactive";
}

export default function CRMDashboardPage() {
  const [stats, setStats] = useState<EmployeeStat[]>([]);
  const [engagement, setEngagement] = useState<EngagementSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get<EmployeeStat[]>("/crm/dashboard"),
      api.get<EngagementSummary[]>("/crm/dashboard/engagement").catch(() => []),
    ])
      .then(([s, e]) => {
        setStats(s);
        setEngagement(e);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">{error}</div>
      </div>
    );
  }

  const totals = stats.reduce(
    (acc, s) => ({
      leads: acc.leads + s.total_leads,
      contacted: acc.contacted + s.contacted,
      conversions: acc.conversions + s.conversions,
      overdue: acc.overdue + s.overdue_follow_ups,
    }),
    { leads: 0, contacted: 0, conversions: 0, overdue: 0 }
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">CRM Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Employee performance overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center">
            <Users size={20} className="text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totals.leads}</p>
          <p className="text-xs text-zinc-500 font-medium">Total Leads Assigned</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="bg-cyan-500/10 w-10 h-10 rounded-lg flex items-center justify-center">
            <Phone size={20} className="text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totals.contacted}</p>
          <p className="text-xs text-zinc-500 font-medium">Total Contacted</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="bg-emerald-500/10 w-10 h-10 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totals.conversions}</p>
          <p className="text-xs text-zinc-500 font-medium">Total Conversions</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="bg-red-500/10 w-10 h-10 rounded-lg flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totals.overdue}</p>
          <p className="text-xs text-zinc-500 font-medium">Overdue Follow Ups</p>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-zinc-400 text-left">
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium text-center">Total Leads</th>
              <th className="px-4 py-3 font-medium text-center">Contacted</th>
              <th className="px-4 py-3 font-medium text-center">Conversions</th>
              <th className="px-4 py-3 font-medium text-center">Overdue</th>
              <th className="px-4 py-3 font-medium text-center">Activity (7d)</th>
              <th className="px-4 py-3 font-medium text-center">Contact Rate</th>
              <th className="px-4 py-3 font-medium w-8"></th>
            </tr>
          </thead>
          <tbody>
            {stats.map((emp) => {
              const contactRate = emp.total_leads > 0
                ? ((emp.contacted / emp.total_leads) * 100).toFixed(0)
                : "0";
              return (
                <tr
                  key={emp.employee_id}
                  onClick={() => navigate(`/crm/employees/${emp.employee_id}`)}
                  className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium text-white">{emp.employee_name}</td>
                  <td className="px-4 py-3 text-center text-zinc-300">{emp.total_leads}</td>
                  <td className="px-4 py-3 text-center text-cyan-400">{emp.contacted}</td>
                  <td className="px-4 py-3 text-center text-emerald-400">{emp.conversions}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={emp.overdue_follow_ups > 0 ? "text-red-400 font-bold" : "text-zinc-500"}>
                      {emp.overdue_follow_ups}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="flex items-center justify-center gap-1 text-zinc-300">
                      <Activity size={12} className="text-green-400" /> {emp.activity_this_week}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: `${contactRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400">{contactRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight size={14} className="text-zinc-600" />
                  </td>
                </tr>
              );
            })}
            {stats.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                  No employees assigned yet. Add employees and assign campaigns.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Engagement Panel */}
      {engagement.length > 0 && (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
          <h3 className="text-sm font-bold text-zinc-300 mb-4 flex items-center gap-2">
            <Monitor size={16} className="text-zinc-500" /> Team Activity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {engagement.map((e) => (
              <div
                key={e.employee_id}
                onClick={() => navigate(`/crm/employees/${e.employee_id}`)}
                className="flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    e.status === "online"
                      ? "bg-green-500 animate-pulse"
                      : e.status === "active_today"
                      ? "bg-yellow-500"
                      : "bg-zinc-600"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{e.employee_name}</p>
                  <p className="text-xs text-zinc-500">
                    {e.status === "online"
                      ? "Online now"
                      : e.last_seen
                      ? `Last seen ${new Date(e.last_seen).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
                      : "Never seen"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock size={10} /> {e.time_today_minutes}m today
                  </p>
                  <p className="text-xs text-zinc-500">
                    {e.idle_days > 0 ? `${e.idle_days}d idle` : `${e.time_this_week_minutes}m/wk`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
