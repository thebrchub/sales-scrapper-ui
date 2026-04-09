import {
  Users,
  Flame,
  Thermometer,
  Snowflake,
  ArrowRight,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
// import StatCard from "../components/StatCard"; // You can remove this if you prefer these new bespoke dashboard widgets!
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
    <div className="animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          Overview
          <div className="px-2.5 py-1 rounded-md bg-accent-start/10 border border-accent-start/20 text-accent-start text-xs font-semibold flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-start opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-start"></span>
            </span>
            Live
          </div>
        </h2>
        <p className="text-zinc-400 mt-1.5 text-sm">Monitor your scraping campaigns and lead pipeline.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Leads */}
        <div className="group relative rounded-2xl border border-white/10 bg-[#09090b] p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(52,211,153,0.3)] hover:border-accent-start/50">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 text-accent-start">
            <Users size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-accent-start/10 text-accent-start border border-accent-start/20">
                <Users size={20} />
              </div>
              <h3 className="font-medium text-zinc-400 text-sm">Total Leads</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">{total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Hot Leads */}
        <div className="group relative rounded-2xl border border-white/10 bg-[#09090b] p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(248,113,113,0.2)] hover:border-red-400/50">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 text-red-400">
            <Flame size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <Flame size={20} />
              </div>
              <h3 className="font-medium text-zinc-400 text-sm">Hot (70+)</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">{hot.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Warm Leads */}
        <div className="group relative rounded-2xl border border-white/10 bg-[#09090b] p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(251,191,36,0.2)] hover:border-amber-400/50">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 text-amber-400">
            <Thermometer size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Thermometer size={20} />
              </div>
              <h3 className="font-medium text-zinc-400 text-sm">Warm (40-69)</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">{warm.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Cold Leads */}
        <div className="group relative rounded-2xl border border-white/10 bg-[#09090b] p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(96,165,250,0.2)] hover:border-blue-400/50">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 text-blue-400">
            <Snowflake size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Snowflake size={20} />
              </div>
              <h3 className="font-medium text-zinc-400 text-sm">Cold (&lt;40)</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">{cold.toLocaleString()}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Section Divider */}
      <div className="mt-10 mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity size={18} className="text-accent-start" />
          Quick Actions
        </h3>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Link
          to="/campaigns"
          className="relative group overflow-hidden flex items-center justify-between rounded-2xl border border-white/10 bg-[#09090b] p-6 transition-all duration-300 hover:border-accent-start/40 hover:shadow-lg"
        >
          {/* Subtle hover gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent-start/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white group-hover:text-accent-start transition-colors">Manage Campaigns</h3>
            <p className="text-sm text-zinc-400 mt-1">Create, edit, and track your active scraping bots</p>
          </div>
          <div className="relative z-10 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-start/20 transition-colors">
            <ArrowRight size={20} className="text-zinc-400 group-hover:text-accent-start group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          to="/leads"
          className="relative group overflow-hidden flex items-center justify-between rounded-2xl border border-white/10 bg-[#09090b] p-6 transition-all duration-300 hover:border-accent-start/40 hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-start/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white group-hover:text-accent-start transition-colors">Lead Database</h3>
            <p className="text-sm text-zinc-400 mt-1">Browse, filter, score, and export your captured leads</p>
          </div>
          <div className="relative z-10 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-start/20 transition-colors">
            <ArrowRight size={20} className="text-zinc-400 group-hover:text-accent-start group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>
    </div>
  );
}