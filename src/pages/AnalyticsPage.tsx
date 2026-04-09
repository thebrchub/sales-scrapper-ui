import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useDashboardStats } from "../hooks/useApi";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";

const SCORE_COLORS = ["#22c55e", "#f59e0b", "#6b7280"];

export default function AnalyticsPage() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBox message={(error as Error).message} />;

  const s = data!;

  const scoreData = [
    { name: "Hot (70+)", value: s.hot_leads },
    { name: "Warm (40-70)", value: s.warm_leads },
    { name: "Cold (<40)", value: s.cold_leads },
  ];

  const summaryData = [
    { name: "Total", value: s.total_leads },
    { name: "Hot", value: s.hot_leads },
    { name: "Warm", value: s.warm_leads },
    { name: "Cold", value: s.cold_leads },
    { name: "Today", value: s.leads_today },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-6">Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution Pie */}
        <div className="rounded-xl border border-border-default bg-surface-card p-5">
          <h3 className="text-sm font-medium text-text-secondary mb-4">
            Score Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {scoreData.map((_, i) => (
                    <Cell key={i} fill={SCORE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#16161f",
                    border: "1px solid #2a2a3a",
                    borderRadius: "8px",
                    color: "#f0f0f5",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {scoreData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs text-text-secondary">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: SCORE_COLORS[i] }}
                />
                {d.name}: {d.value}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Bar Chart */}
        <div className="rounded-xl border border-border-default bg-surface-card p-5">
          <h3 className="text-sm font-medium text-text-secondary mb-4">
            Lead Summary
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#8888a0", fontSize: 12 }}
                  axisLine={{ stroke: "#2a2a3a" }}
                />
                <YAxis
                  tick={{ fill: "#8888a0", fontSize: 12 }}
                  axisLine={{ stroke: "#2a2a3a" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#16161f",
                    border: "1px solid #2a2a3a",
                    borderRadius: "8px",
                    color: "#f0f0f5",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 rounded-xl border border-border-default bg-surface-card p-5">
          <h3 className="text-sm font-medium text-text-secondary mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {s.total_leads.toLocaleString()}
              </p>
              <p className="text-xs text-text-secondary mt-1">Total Leads</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{s.total_campaigns}</p>
              <p className="text-xs text-text-secondary mt-1">Campaigns</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{s.avg_score}</p>
              <p className="text-xs text-text-secondary mt-1">Avg Score</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{s.dead_jobs}</p>
              <p className="text-xs text-text-secondary mt-1">Dead Jobs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
