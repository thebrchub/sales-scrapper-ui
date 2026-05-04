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

  // Custom Tooltip component for Recharts to match our glassmorphism theme
  const CustomTooltip = ({ active, payload, label, isPie }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl outline-none transition-transform ${isPie ? "-translate-y-16" : ""}`}>
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
          Analytics Overview
        </h2>
        <p className="text-sm text-zinc-400 mt-1.5">
          Deep dive into your pipeline health and lead distribution.
        </p>
      </div>

      {/* Skeuomorphic KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
        <div className="group relative rounded-2xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#0a0a0c] p-5 sm:p-6 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(52,211,153,0.15)] hover:border-accent-start/30 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-accent-start pointer-events-none"><Users size={80} strokeWidth={1} /></div>
          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:bg-accent-start/10 transition-colors">
                <Users size={16} className="text-accent-start" />
              </div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Leads</p>
            </div>
            <p className="text-3xl font-black text-white">{total.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="group relative rounded-2xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#0a0a0c] p-5 sm:p-6 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(248,113,113,0.15)] hover:border-red-400/30 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-red-400 pointer-events-none"><Flame size={80} strokeWidth={1} /></div>
          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                <Flame size={16} className="text-red-400" />
              </div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Hot Leads</p>
            </div>
            <p className="text-3xl font-black text-red-400">{hot.toLocaleString()}</p>
          </div>
        </div>

        <div className="group relative rounded-2xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#0a0a0c] p-5 sm:p-6 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(251,191,36,0.15)] hover:border-amber-400/30 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-amber-400 pointer-events-none"><Thermometer size={80} strokeWidth={1} /></div>
          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                <Thermometer size={16} className="text-amber-400" />
              </div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Warm Leads</p>
            </div>
            <p className="text-3xl font-black text-amber-400">{warm.toLocaleString()}</p>
          </div>
        </div>

        <div className="group relative rounded-2xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#0a0a0c] p-5 sm:p-6 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(96,165,250,0.15)] hover:border-blue-400/30 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-blue-400 pointer-events-none"><Snowflake size={80} strokeWidth={1} /></div>
          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                <Snowflake size={16} className="text-blue-400" />
              </div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Cold Leads</p>
            </div>
            <p className="text-3xl font-black text-blue-400">{cold.toLocaleString()}</p>
          </div>
        </div>

        <div className="group relative rounded-2xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#0a0a0c] p-5 sm:p-6 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(52,211,153,0.15)] hover:border-accent-start/30 hover:-translate-y-1 col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-accent-start pointer-events-none"><PhoneCall size={80} strokeWidth={1} /></div>
          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:bg-accent-start/10 transition-colors">
                <PhoneCall size={16} className="text-accent-start" />
              </div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">With Phone</p>
            </div>
            <p className="text-3xl font-black text-white">{withPhone.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Score Distribution Pie - Skeuomorphic */}
        <div className="rounded-3xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#09090b] p-6 sm:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.6)] lg:col-span-1 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <PieChartIcon size={18} className="text-accent-start" />
            </div>
            Score Distribution
          </h3>
          
          <div className="h-64 min-h-[250px] w-full flex-1 relative">
            <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
              <PieChart style={{ outline: 'none' }}>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  style={{ outline: 'none' }}
                >
                  {scoreData.map((_, i) => (
                    <Cell key={i} fill={SCORE_COLORS[i]} className="drop-shadow-md cursor-pointer hover:opacity-80 transition-opacity" style={{ outline: 'none' }} />
                  ))}
                </Pie>
                <Tooltip content={(props) => <CustomTooltip {...props} isPie />} cursor={false} isAnimationActive={false} wrapperStyle={{ outline: 'none' }} />
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
                    className="w-3 h-3 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"
                    style={{ backgroundColor: SCORE_COLORS[i], boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), 0 0 10px ${SCORE_COLORS[i]}40` }}
                  />
                  <span className="text-sm font-medium text-zinc-300">{d.name}</span>
                </div>
                <span className="text-sm font-bold text-white">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Bar Chart - Skeuomorphic */}
        <div className="rounded-3xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#09090b] p-6 sm:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.6)] lg:col-span-2 flex flex-col relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-start/5 blur-[100px] rounded-full pointer-events-none" />

          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <BarChart3 size={18} className="text-accent-start" />
            </div>
            Pipeline Breakdown
          </h3>
          
          <div className="h-[340px] w-full relative z-10 mt-auto">
            <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
              <BarChart data={summaryData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }} style={{ outline: 'none' }}>
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
                  tick={{ fill: "#71717a", fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                  dy={10}
                  interval={0}
                />
                <YAxis
                  tick={{ fill: "#71717a", fontSize: 12, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} isAnimationActive={false} wrapperStyle={{ outline: 'none' }} />
                
                <Bar 
                  dataKey="value" 
                  fill="url(#colorBar)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                  animationDuration={1500}
                  style={{ outline: 'none' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
