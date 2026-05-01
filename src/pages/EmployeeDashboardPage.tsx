import { useState, useEffect } from "react";
import { api } from "../api/client";
import { Loader2, Phone, Clock, UserCheck, XCircle, TrendingUp, Target, CalendarClock } from "lucide-react";

interface EmployeeStats {
  employee_id: string;
  employee_name: string;
  total_leads: number;
  contacted: number;
  conversions: number;
  overdue_follow_ups: number;
  activity_this_week: number;
}

export default function EmployeeDashboardPage() {
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<EmployeeStats>("/crm/stats")
      .then(setStats)
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
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total Leads", value: stats?.total_leads ?? 0, icon: Target, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Contacted", value: stats?.contacted ?? 0, icon: Phone, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "Conversions", value: stats?.conversions ?? 0, icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Overdue Follow Ups", value: stats?.overdue_follow_ups ?? 0, icon: CalendarClock, color: "text-red-400", bg: "bg-red-500/10" },
    { label: "Activity This Week", value: stats?.activity_this_week ?? 0, icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Pending", value: Math.max(0, (stats?.total_leads ?? 0) - (stats?.contacted ?? 0) - (stats?.conversions ?? 0)), icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  ];

  const total = stats?.total_leads || 0;
  const conversionRate = total > 0 ? ((stats!.conversions / total) * 100).toFixed(1) : "0.0";
  const contactedRate = total > 0 ? ((stats!.contacted / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Your lead performance overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 space-y-2"
          >
            <div className={`${card.bg} w-10 h-10 rounded-lg flex items-center justify-center`}>
              <card.icon size={20} className={card.color} />
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-zinc-500 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-300">Contact Rate</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Progress</span>
              <span className="text-white font-bold">{contactedRate}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                style={{ width: `${contactedRate}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            {stats?.contacted ?? 0} of {stats?.total_leads ?? 0} leads contacted
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-300">Conversion Rate</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Progress</span>
              <span className="text-white font-bold">{conversionRate}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            {stats?.conversions ?? 0} of {stats?.total_leads ?? 0} leads converted
          </p>
        </div>
      </div>
    </div>
  );
}
