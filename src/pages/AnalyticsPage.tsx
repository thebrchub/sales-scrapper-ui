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
import { 
  BarChart3, 
  Flame, 
  Thermometer, 
  Snowflake, 
  Users, 
  PhoneCall,
  PieChart as PieChartIcon
} from "lucide-react";

// Updated to match the Dashboard's visual language
const SCORE_COLORS = ["#f87171", "#fbbf24", "#60a5fa"]; // Red (Hot), Amber (Warm), Blue (Cold)

export default function AnalyticsPage() {
  const { data: allLeads, isLoading, error } = useLeads({ page: 1, page_size: 1 });
  const { data: hotLeads } = useLeads({ page: 1, page_size: 1, score_gte: 70 });
  const { data: warmLeads } = useLeads({ page: 1, page_size: 1, score_gte: 40 });
  const { data: phoneLeads } = useLeads({ page: 1, page_size: 1, has_phone: true });

  if (isLoading) return <div className="py-20"><Spinner /></div>;
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

  // Custom Tooltip component for Recharts to match our glassmorphism theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl">
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">{label || payload[0].name}</p>
          <p className="text-white font-extrabold text-lg">
            {payload[0].value.toLocaleString()} <span className="text-xs font-medium text-zinc-500">leads</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-xl bg-accent-start/10 border border-accent-start/20 flex items-center justify-center">
            <BarChart3 size={20} className="text-accent-start" />
          </div> */}
          Analytics Overview
        </h2>
        <p className="text-sm text-zinc-400 mt-1.5">
          Deep dive into your pipeline health and lead distribution.
        </p>
      </div>

      {/* KPI Stats Row (Moved to top for better UX hierarchy) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="rounded-2xl border border-white/10 bg-[#09090b] p-5 relative overflow-hidden group hover:border-accent-start/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-accent-start"><Users size={40} /></div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Leads</p>
          <p className="text-3xl font-black text-white">{total.toLocaleString()}</p>
        </div>
        
        <div className="rounded-2xl border border-white/10 bg-[#09090b] p-5 relative overflow-hidden group hover:border-red-400/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-red-400"><Flame size={40} /></div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Hot Leads</p>
          <p className="text-3xl font-black text-red-400">{hot.toLocaleString()}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#09090b] p-5 relative overflow-hidden group hover:border-amber-400/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-amber-400"><Thermometer size={40} /></div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Warm Leads</p>
          <p className="text-3xl font-black text-amber-400">{warm.toLocaleString()}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#09090b] p-5 relative overflow-hidden group hover:border-blue-400/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-blue-400"><Snowflake size={40} /></div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Cold Leads</p>
          <p className="text-3xl font-black text-blue-400">{cold.toLocaleString()}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#09090b] p-5 relative overflow-hidden group hover:border-accent-start/30 transition-colors col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-accent-start"><PhoneCall size={40} /></div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">With Phone</p>
          <p className="text-3xl font-black text-white">{withPhone.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Score Distribution Pie */}
        <div className="rounded-3xl border border-white/10 bg-[#09090b] p-6 sm:p-8 shadow-2xl lg:col-span-1 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <PieChartIcon size={18} className="text-accent-start" /> Score Distribution
          </h3>
          
          <div className="h-64 flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {scoreData.map((_, i) => (
                    <Cell key={i} fill={SCORE_COLORS[i]} className="drop-shadow-md cursor-pointer hover:opacity-80 transition-opacity" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label inside Pie Chart */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-white">{total}</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Total</span>
            </div>
          </div>

          {/* Premium Custom Legend */}
          <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/5">
            {scoreData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shadow-lg"
                    style={{ backgroundColor: SCORE_COLORS[i], boxShadow: `0 0 10px ${SCORE_COLORS[i]}40` }}
                  />
                  <span className="text-sm font-medium text-zinc-300">{d.name}</span>
                </div>
                <span className="text-sm font-bold text-white">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Bar Chart */}
        <div className="rounded-3xl border border-white/10 bg-[#09090b] p-6 sm:p-8 shadow-2xl lg:col-span-2 flex flex-col relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-start/5 blur-[100px] rounded-full pointer-events-none" />

          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
            <BarChart3 size={18} className="text-accent-start" /> Pipeline Breakdown
          </h3>
          
          <div className="h-[340px] w-full relative z-10 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                {/* Custom SVG Gradient for Bars */}
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent-start)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--color-accent-end)" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#71717a", fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: "#71717a", fontSize: 12, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                
                <Bar 
                  dataKey="value" 
                  fill="url(#colorBar)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}