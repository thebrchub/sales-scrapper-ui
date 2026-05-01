import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import {
  Loader2,
  ArrowLeft,
  Target,
  Phone,
  UserCheck,
  CalendarClock,
  TrendingUp,
  Activity,
  Clock,
  Monitor,
  Zap,
  Eye,
} from "lucide-react";
import type { LeadActivity, PaginatedResponse } from "../types";

interface EmployeeStat {
  employee_id: string;
  employee_name: string;
  total_leads: number;
  contacted: number;
  conversions: number;
  overdue_follow_ups: number;
  activity_this_week: number;
}

interface EngagementStats {
  employee_id: string;
  employee_name: string;
  time_today_minutes: number;
  time_this_week_minutes: number;
  avg_daily_minutes: number;
  actions_per_hour: number;
  last_seen: string | null;
  idle_days: number;
  daily_streak: number;
  status: "online" | "active_today" | "inactive";
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-zinc-500/20 text-zinc-400",
  contacted: "bg-blue-500/20 text-blue-400",
  follow_up: "bg-orange-500/20 text-orange-400",
  converted: "bg-emerald-500/20 text-emerald-400",
  not_interested: "bg-red-500/20 text-red-400",
  closed: "bg-zinc-600/20 text-zinc-500",
};

export default function EmployeeActivityPage() {
  const { id } = useParams<{ id: string }>();
  const [stats, setStats] = useState<EmployeeStat | null>(null);
  const [engagement, setEngagement] = useState<EngagementStats | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.get<EmployeeStat>(`/crm/employees/${id}/stats`),
      api.get<EngagementStats>(`/crm/employees/${id}/engagement`).catch(() => null),
      api.get<PaginatedResponse<LeadActivity>>(`/crm/employees/${id}/activity?page=${page}&page_size=20`),
    ])
      .then(([s, e, a]) => {
        setStats(s);
        setEngagement(e);
        setActivities(a.data || []);
        setTotalPages(a.meta?.totalPages || 1);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, page]);

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

  const total = stats?.total_leads || 0;
  const contactRate = total > 0 ? ((stats!.contacted / total) * 100).toFixed(0) : "0";
  const conversionRate = total > 0 ? ((stats!.conversions / total) * 100).toFixed(0) : "0";

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/crm"
          className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{stats?.employee_name || "Employee"}</h1>
          <p className="text-zinc-400 text-sm mt-0.5">Performance & activity details</p>
        </div>
        {engagement && (
          <div className="ml-auto flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                engagement.status === "online"
                  ? "bg-green-500 animate-pulse"
                  : engagement.status === "active_today"
                  ? "bg-yellow-500"
                  : "bg-zinc-600"
              }`}
            />
            <span className="text-xs font-medium text-zinc-400 capitalize">
              {engagement.status === "active_today" ? "Active Today" : engagement.status}
            </span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Leads", value: stats?.total_leads ?? 0, icon: Target, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Contacted", value: stats?.contacted ?? 0, icon: Phone, color: "text-cyan-400", bg: "bg-cyan-500/10" },
          { label: "Conversions", value: stats?.conversions ?? 0, icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Overdue", value: stats?.overdue_follow_ups ?? 0, icon: CalendarClock, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Activity (7d)", value: stats?.activity_this_week ?? 0, icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Contact Rate", value: `${contactRate}%`, icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map((card) => (
          <div key={card.label} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 space-y-2">
            <div className={`${card.bg} w-10 h-10 rounded-lg flex items-center justify-center`}>
              <card.icon size={20} className={card.color} />
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-zinc-500 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Engagement Panel */}
      {engagement && (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
          <h3 className="text-sm font-bold text-zinc-300 mb-4 flex items-center gap-2">
            <Monitor size={16} className="text-zinc-500" /> Engagement Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 flex items-center gap-1.5"><Clock size={12} /> Time Today</p>
              <p className="text-lg font-bold text-white">{engagement.time_today_minutes}m</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 flex items-center gap-1.5"><Clock size={12} /> Time This Week</p>
              <p className="text-lg font-bold text-white">{engagement.time_this_week_minutes}m</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 flex items-center gap-1.5"><Zap size={12} /> Actions/Hour</p>
              <p className="text-lg font-bold text-white">{engagement.actions_per_hour.toFixed(1)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 flex items-center gap-1.5"><Eye size={12} /> Last Seen</p>
              <p className="text-lg font-bold text-white">
                {engagement.last_seen
                  ? new Date(engagement.last_seen).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                  : "Never"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
            <div className="space-y-1">
              <p className="text-xs text-zinc-500">Avg Daily Usage</p>
              <p className="text-sm font-bold text-zinc-300">{engagement.avg_daily_minutes}m/day</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-500">Daily Streak</p>
              <p className="text-sm font-bold text-zinc-300">{engagement.daily_streak} days</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-500">Idle Days</p>
              <p className={`text-sm font-bold ${engagement.idle_days > 2 ? "text-red-400" : "text-zinc-300"}`}>
                {engagement.idle_days}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-300">Contact Rate</h3>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">{stats?.contacted ?? 0} / {total}</span>
            <span className="text-white font-bold">{contactRate}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
              style={{ width: `${contactRate}%` }}
            />
          </div>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-300">Conversion Rate</h3>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">{stats?.conversions ?? 0} / {total}</span>
            <span className="text-white font-bold">{conversionRate}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
              style={{ width: `${conversionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5">
          <h3 className="text-sm font-bold text-zinc-300">Recent Activity</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-zinc-400 text-left">
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Notes</th>
              <th className="px-4 py-3 font-medium">Last Contact</th>
              <th className="px-4 py-3 font-medium">Follow Up</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr key={a.activity_id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium text-white max-w-[180px] truncate">{a.business_name}</td>
                <td className="px-4 py-3 text-zinc-300 text-xs">{a.phone_e164 || "-"}</td>
                <td className="px-4 py-3 text-zinc-400">{a.city}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${STATUS_COLORS[a.status] || "bg-zinc-700 text-zinc-300"}`}>
                    {a.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-400 text-xs max-w-[200px] truncate">{a.notes || "-"}</td>
                <td className="px-4 py-3 text-zinc-400 text-xs">
                  {a.last_contact ? new Date(a.last_contact).toLocaleDateString() : "-"}
                </td>
                <td className="px-4 py-3 text-zinc-400 text-xs">
                  {a.next_follow_up ? new Date(a.next_follow_up).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
            {activities.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                  No activity recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-white/5">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-bold text-zinc-400 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-30"
            >
              Prev
            </button>
            <span className="text-xs text-zinc-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs font-bold text-zinc-400 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
