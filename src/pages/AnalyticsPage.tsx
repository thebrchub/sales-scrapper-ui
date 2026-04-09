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
import { useLeads } from "../hooks/useApi";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";

const SCORE_COLORS = ["#22c55e", "#f59e0b", "#6b7280"];

export default function AnalyticsPage() {
  const { data: allLeads, isLoading, error } = useLeads({ page: 1, page_size: 1 });
  const { data: hotLeads } = useLeads({ page: 1, page_size: 1, score_gte: 70 });
  const { data: warmLeads } = useLeads({ page: 1, page_size: 1, score_gte: 40 });
  const { data: phoneLeads } = useLeads({ page: 1, page_size: 1, has_phone: true });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBox message={(error as Error).message} />;

  const total = allLeads?.meta?.total ?? 0;
  const hot = hotLeads?.meta?.total ?? 0;
  const warm = (warmLeads?.meta?.total ?? 0) - hot;
  const cold = total - hot - warm;
  const withPhone = phoneLeads?.meta?.total ?? 0;

  const scoreData = [
    { name: "Hot (70+)", value: hot },
    { name: "Warm (40-69)", value: warm },
    { name: "Cold (<40)", value: cold },
  ];

  const summaryData = [
    { name: "Total", value: total },
    { name: "Hot", value: hot },
    { name: "Warm", value: warm },
    { name: "Cold", value: cold },
    { name: "With Phone", value: withPhone },
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
                {total.toLocaleString()}
              </p>
              <p className="text-xs text-text-secondary mt-1">Total Leads</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{hot.toLocaleString()}</p>
              <p className="text-xs text-text-secondary mt-1">Hot Leads</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{warm.toLocaleString()}</p>
              <p className="text-xs text-text-secondary mt-1">Warm Leads</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{withPhone.toLocaleString()}</p>
              <p className="text-xs text-text-secondary mt-1">With Phone</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
