import {
  Users,
  Flame,
  Thermometer,
  Snowflake,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import { useLeads } from "../hooks/useApi";

export default function DashboardPage() {
  const { data: allLeads, isLoading, error } = useLeads({ page: 1, page_size: 1 });
  const { data: hotLeads } = useLeads({ page: 1, page_size: 1, score_gte: 70 });
  const { data: warmLeads } = useLeads({ page: 1, page_size: 1, score_gte: 40 });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBox message={(error as Error).message} />;

  const total = allLeads?.meta?.total ?? 0;
  const hot = hotLeads?.meta?.total ?? 0;
  const warm = (warmLeads?.meta?.total ?? 0) - hot;
  const cold = total - hot - warm;

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={total.toLocaleString()}
          icon={<Users size={20} />}
          accent
        />
        <StatCard
          title="Hot Leads (70+)"
          value={hot.toLocaleString()}
          icon={<Flame size={20} />}
        />
        <StatCard
          title="Warm Leads (40-69)"
          value={warm.toLocaleString()}
          icon={<Thermometer size={20} />}
        />
        <StatCard
          title="Cold Leads (<40)"
          value={cold.toLocaleString()}
          icon={<Snowflake size={20} />}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/campaigns"
          className="flex items-center justify-between rounded-xl border border-border-default bg-surface-card p-5 hover:border-accent-start/30 transition-colors group"
        >
          <div>
            <h3 className="font-medium text-text-primary">Campaigns</h3>
            <p className="text-sm text-text-secondary mt-1">Create and track scraping campaigns</p>
          </div>
          <ArrowRight size={18} className="text-text-muted group-hover:text-accent-start transition-colors" />
        </Link>
        <Link
          to="/leads"
          className="flex items-center justify-between rounded-xl border border-border-default bg-surface-card p-5 hover:border-accent-start/30 transition-colors group"
        >
          <div>
            <h3 className="font-medium text-text-primary">Leads</h3>
            <p className="text-sm text-text-secondary mt-1">Browse, filter, and export leads</p>
          </div>
          <ArrowRight size={18} className="text-text-muted group-hover:text-accent-start transition-colors" />
        </Link>
      </div>
    </div>
  );
}
