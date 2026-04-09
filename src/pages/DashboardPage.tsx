import {
  Users,
  Megaphone,
  Zap,
  AlertTriangle,
  TrendingUp,
  Flame,
  Thermometer,
  Snowflake,
} from "lucide-react";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import { useDashboardStats } from "../hooks/useApi";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBox message={(error as Error).message} />;

  const s = data!;

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={s.total_leads.toLocaleString()}
          icon={<Users size={20} />}
          accent
        />
        <StatCard
          title="Campaigns"
          value={s.total_campaigns}
          icon={<Megaphone size={20} />}
        />
        <StatCard
          title="Active Jobs"
          value={s.active_jobs}
          icon={<Zap size={20} />}
        />
        <StatCard
          title="Dead Jobs"
          value={s.dead_jobs}
          icon={<AlertTriangle size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <StatCard
          title="Leads Today"
          value={s.leads_today}
          icon={<TrendingUp size={20} />}
          trend={s.leads_today > 0 ? `+${s.leads_today} today` : undefined}
        />
        <StatCard
          title="Hot Leads (70+)"
          value={s.hot_leads}
          icon={<Flame size={20} />}
        />
        <StatCard
          title="Warm Leads (40-70)"
          value={s.warm_leads}
          icon={<Thermometer size={20} />}
        />
        <StatCard
          title="Cold Leads (<40)"
          value={s.cold_leads}
          icon={<Snowflake size={20} />}
        />
      </div>

      <div className="mt-6 rounded-xl border border-border-default bg-surface-card p-5">
        <p className="text-sm text-text-secondary">
          Average Lead Score:{" "}
          <span className="font-semibold text-text-primary">{s.avg_score}</span>
        </p>
      </div>
    </div>
  );
}
