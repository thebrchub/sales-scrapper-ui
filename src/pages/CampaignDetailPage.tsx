import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  Tags, 
  Briefcase, 
  ShieldOff, 
  Calendar, 
  RefreshCw, 
  Users, 
  Activity,
  Target
} from "lucide-react";
import { useCampaignStatus } from "../hooks/useApi";
import StatusBadge from "../components/StatusBadge";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: campaign, isLoading, error } = useCampaignStatus(id!);

  if (isLoading) return <div className="py-20"><Spinner /></div>;
  if (error) return <ErrorBox message={(error as Error).message} />;
  if (!campaign) return <ErrorBox message="Campaign not found" />;

  const pct =
    campaign.jobs_total > 0
      ? Math.round((campaign.jobs_completed / campaign.jobs_total) * 100)
      : 0;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Premium Back Navigation */}
      <Link
        to="/campaigns"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-6 group"
      >
        <div className="p-1.5 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        </div>
        Back to Campaigns
      </Link>

      {/* Campaign Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            {campaign.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-zinc-300">
              <MapPin size={14} className="text-accent-start" />
              {campaign.cities?.join(", ")}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-zinc-300">
              <Tags size={14} className="text-accent-start" />
              {campaign.categories?.join(", ")}
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <StatusBadge status={campaign.status} />
        </div>
      </div>

      {/* Hero Telemetry Card */}
      <div className="rounded-3xl border border-white/10 bg-[#09090b] p-6 sm:p-8 mb-6 shadow-2xl relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-start/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Left Side: Progress Bar */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="flex items-end justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity size={18} className="text-accent-start" />
                  Extraction Progress
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {campaign.jobs_completed} of {campaign.jobs_total} jobs completed
                </p>
              </div>
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-start to-accent-end">
                {pct}%
              </span>
            </div>
            
            {/* High-end Progress Track */}
            <div className="h-4 rounded-full bg-black/60 border border-white/5 overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-start to-accent-end transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${pct}%` }}
              >
                {/* NEW: Active Processing Stripes Overlay */}
                {campaign.status === "running" && pct < 100 && (
                  <div className="absolute inset-0 bg-stripes animate-stripes opacity-60" />
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Leads Found Hero Stat */}
          <div className="lg:border-l border-white/10 lg:pl-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
              <Users size={16} className="text-accent-start" />
              Total Leads Extracted
            </div>
            <div className="text-5xl font-black text-white tracking-tight drop-shadow-md">
              {campaign.leads_found.toLocaleString()}
            </div>
            {campaign.status === "running" && (
              <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-accent-start animate-pulse">
                <Target size={12} />
                Actively hunting...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campaign Configuration Details */}
      <div className="rounded-3xl border border-white/10 bg-[#09090b] p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white mb-6">Engine Configuration</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Sources */}
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Briefcase size={16} />
              <span className="text-xs font-medium uppercase tracking-wider">Sources</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {campaign.sources?.map((s: string) => s.replace(/_/g, " ")).join(", ")}
            </p>
          </div>

          {/* Drop No-Contact */}
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <ShieldOff size={16} />
              <span className="text-xs font-medium uppercase tracking-wider">Filtering</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">Drop No-Contact:</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${campaign.drop_no_contact ? 'bg-amber-500/10 text-amber-400' : 'bg-white/10 text-zinc-400'}`}>
                {campaign.drop_no_contact ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Calendar size={16} />
              <span className="text-xs font-medium uppercase tracking-wider">Created</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {new Date(campaign.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <RefreshCw size={16} />
              <span className="text-xs font-medium uppercase tracking-wider">Last Updated</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {new Date(campaign.updated_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* HIDDEN FOR NOW: Auto Rescrape
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <RefreshCw size={16} />
              <span className="text-xs font-medium uppercase tracking-wider">Automation</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">Auto Rescrape:</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${campaign.auto_rescrape ? 'bg-accent-start/10 text-accent-start' : 'bg-white/10 text-zinc-400'}`}>
                {campaign.auto_rescrape ? "Active" : "Off"}
              </span>
            </div>
          </div>
          */}

        </div>
      </div>
    </div>
  );
}