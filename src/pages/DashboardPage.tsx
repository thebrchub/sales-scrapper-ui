import {
  Users,
  Flame,
  Thermometer,
  Snowflake,
  ArrowRight,
  Activity,
  Lightbulb,
  Target,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
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
    <div className="animate-in fade-in duration-500 w-full max-w-full overflow-x-hidden">
      
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

      {/* Metrics Grid - Skeuomorphic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Leads */}
        <div className="group relative rounded-2xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#0a0a0c] p-6 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(52,211,153,0.15)] hover:border-accent-start/30 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 text-accent-start pointer-events-none">
            <Users size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-4">
              {/* Neumorphic depressed button icon */}
              <div className="w-11 h-11 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:bg-accent-start/10 transition-colors">
                <Users size={20} className="text-accent-start" />
              </div>
              <h3 className="font-bold text-zinc-400 text-sm uppercase tracking-wider">Total Leads</h3>
            </div>
            <div>
              <p className="text-4xl font-black text-white tracking-tight">{total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Hot Leads */}
        <div className="group relative rounded-2xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#0a0a0c] p-6 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(248,113,113,0.15)] hover:border-red-400/30 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 text-red-400 pointer-events-none">
            <Flame size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                <Flame size={20} className="text-red-400" />
              </div>
              <h3 className="font-bold text-zinc-400 text-sm uppercase tracking-wider">Hot <span className="text-[10px]">(70+)</span></h3>
            </div>
            <div>
              <p className="text-4xl font-black text-white tracking-tight">{hot.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Warm Leads */}
        <div className="group relative rounded-2xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#0a0a0c] p-6 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(251,191,36,0.15)] hover:border-amber-400/30 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 text-amber-400 pointer-events-none">
            <Thermometer size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                <Thermometer size={20} className="text-amber-400" />
              </div>
              <h3 className="font-bold text-zinc-400 text-sm uppercase tracking-wider">Warm <span className="text-[10px]">(40-69)</span></h3>
            </div>
            <div>
              <p className="text-4xl font-black text-white tracking-tight">{warm.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Cold Leads */}
        <div className="group relative rounded-2xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#0a0a0c] p-6 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(96,165,250,0.15)] hover:border-blue-400/30 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 text-blue-400 pointer-events-none">
            <Snowflake size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                <Snowflake size={20} className="text-blue-400" />
              </div>
              <h3 className="font-bold text-zinc-400 text-sm uppercase tracking-wider">Cold <span className="text-[10px]">(&lt;40)</span></h3>
            </div>
            <div>
              <p className="text-4xl font-black text-white tracking-tight">{cold.toLocaleString()}</p>
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

      {/* Quick Actions Grid - Skeuomorphic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Link
          to="/campaigns"
          className="relative group overflow-hidden flex items-center justify-between rounded-2xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#0a0a0c] p-6 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(52,211,153,0.15)] hover:border-accent-start/30 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-start/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white group-hover:text-accent-start transition-colors">Manage Campaigns</h3>
            <p className="text-sm text-zinc-400 mt-1">Create, edit, and track your active scraping bots</p>
          </div>
          <div className="relative z-10 w-11 h-11 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:bg-accent-start/10 transition-colors">
            <ArrowRight size={20} className="text-zinc-400 group-hover:text-accent-start group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link
          to="/leads"
          className="relative group overflow-hidden flex items-center justify-between rounded-2xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#0a0a0c] p-6 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(52,211,153,0.15)] hover:border-accent-start/30 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-start/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white group-hover:text-accent-start transition-colors">Lead Database</h3>
            <p className="text-sm text-zinc-400 mt-1">Browse, filter, score, and export your captured leads</p>
          </div>
          <div className="relative z-10 w-11 h-11 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:bg-accent-start/10 transition-colors">
            <ArrowRight size={20} className="text-zinc-400 group-hover:text-accent-start group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>

      {/* Visually Distinct Strategy Panel - Main Skeuomorphic Board */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#09090b] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* Subtle internal glow just for this panel */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 mb-8">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Lightbulb size={22} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            Sales Strategy & Tips
          </h3>
          <p className="text-sm text-zinc-400 mt-1.5">
            Best practices for maximizing your conversion rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative z-10">
          
          {/* Tip 1 - Recessed Carved Style */}
          <div className="rounded-2xl border border-white/5 bg-[#09090b] p-5 relative overflow-hidden group hover:bg-[#0c0c0e] transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-amber-400/10 transition-colors" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-[#121214] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <Target size={18} className="text-amber-400" />
              </div>
              <h4 className="font-bold text-white">Niche Down</h4>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed relative z-10">
              Don't launch campaigns broadly. Target highly specific, high-ticket niches (e.g., "Emergency Plumbers" or "Roofing Contractors") in exact cities to ensure relevance when you call.
            </p>
          </div>

          {/* Tip 2 - Recessed Carved Style */}
          <div className="rounded-2xl border border-white/5 bg-[#09090b] p-5 relative overflow-hidden group hover:bg-[#0c0c0e] transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-red-400/10 transition-colors" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-[#121214] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <Flame size={18} className="text-red-400" />
              </div>
              <h4 className="font-bold text-white">Prioritize Hot Leads</h4>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed relative z-10">
              Sort your database by Score. Businesses scoring <strong className="text-zinc-200">70+</strong> often lack basic web presence, making them the easiest targets for web development, SEO, or marketing pitches.
            </p>
          </div>

          {/* Tip 3 - Recessed Carved Style */}
          <div className="rounded-2xl border border-white/5 bg-[#09090b] p-5 relative overflow-hidden group hover:bg-[#0c0c0e] transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-start/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-accent-start/10 transition-colors" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-[#121214] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <TrendingUp size={18} className="text-accent-start" />
              </div>
              <h4 className="font-bold text-white">Pipeline Hygiene</h4>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed relative z-10">
              Always update lead statuses immediately after outreach. Moving a lead from "New" to "Contacted" prevents your team from double-pitching the same business.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}