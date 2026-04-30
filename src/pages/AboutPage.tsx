import {
  Search,
  Database,
  BarChart3,
  Download,
  Settings,
  Megaphone,
  Users,
  Zap,
  Shield,
  Cpu
} from "lucide-react";

const STEPS = [
  {
    icon: Megaphone,
    title: "1. Create a Campaign",
    description: "Select data sources, target cities, and business niches. The system automatically provisions the data gathering processes.",
  },
  {
    icon: Zap,
    title: "2. Automated Sourcing",
    description: "The engine systematically curates data from your selected sources in the background, gathering phones, emails, and website information.",
  },
  {
    icon: Database,
    title: "3. Processing & Scoring",
    description: "Leads are automatically validated, deduplicated, and scored (0-100) based on data quality and conversion potential.",
  },
  {
    icon: Search,
    title: "4. Browse & Filter",
    description: "Use the Lead Database to quickly filter by location, status, or score to find your best targets.",
  },
  {
    icon: BarChart3,
    title: "5. Pipeline Analytics",
    description: "Monitor campaign health and identify top-tier opportunities via the visual dashboards.",
  },
  {
    icon: Download,
    title: "6. Export Data",
    description: "Download perfectly formatted CSVs of your filtered leads, ready for your CRM or outreach tools.",
  },
];

const TERMINOLOGY = [
  { term: "Lead Score", definition: "A 0-100 rating based on data completeness, web presence, and technology footprint." },
  { term: "Hot Lead", definition: "Score 70+. High conversion potential — prioritize these." },
  { term: "Warm Lead", definition: "Score 40-69. Moderate potential — worth reaching out." },
  { term: "Cold Lead", definition: "Score <40. Lower priority, missing key contact info." },
  { term: "Campaign", definition: "A batch data curation task combining specific sources and locations." },
  // 👇 FIXED: Removed specific platform mentions
  { term: "Source", definition: "The primary public data origin from which business records are aggregated and curated." },
  { term: "Deduplication", definition: "Automatic merging of duplicate records found across different sources." },
  { term: "E.164", definition: "The international phone format (+1234567890) applied to all numbers." },
];

export default function AboutPage() {
  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          About & User Guide
        </h2>
        <p className="text-sm text-zinc-400 mt-1.5 ">
          Everything you need to know to operate the lead generation engine.
        </p>
      </div>

      {/* Hero Overview - Soft Skeuomorphic Main Panel */}
      <div className="rounded-3xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#09090b] p-6 sm:p-10 mb-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-start/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              Platform Overview
            </h3>
            <p className="text-base text-zinc-300 leading-relaxed">
              Leads Generator is an intelligent data aggregation engine that curates business records from multiple public sources. 
              It automatically validates contact information, scores leads based on conversion potential, and removes 
              duplicates to provide you with a clean, actionable pipeline.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 border border-white/5 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.5)] text-xs font-bold text-zinc-300 uppercase tracking-wider">
                <Shield size={14} className="text-accent-start" /> Auto-Validated
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 border border-white/5 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.5)] text-xs font-bold text-zinc-300 uppercase tracking-wider">
                <Users size={14} className="text-accent-start" /> Deduplicated
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 border border-white/5 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.5)] text-xs font-bold text-zinc-300 uppercase tracking-wider">
                <Settings size={14} className="text-accent-start" /> Configurable
              </div>
            </div>
          </div>

          {/* Right Side Visual Fill - Animated Engine Core */}
          <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-2xl bg-[#09090b] border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
              <div className="absolute inset-0 border-4 border-accent-start/30 rounded-full border-t-accent-start border-l-transparent animate-spin duration-3000" />
              <div className="absolute inset-4 border-4 border-white/5 rounded-full" />
              <div className="absolute inset-4 border-4 border-accent-end/30 rounded-full border-b-accent-end border-r-transparent animate-spin-reverse duration-2000" />
              <div className="w-12 h-12 bg-gradient-to-br from-accent-start to-accent-end rounded-full animate-pulse-glow flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                <Cpu size={24} className="text-black" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-start animate-pulse" />
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Engine Ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Grid - Soft Skeuomorphic Cards */}
      <div className="mb-12">
        <h3 className="text-lg font-bold text-white mb-5 ml-1">Workflow Guide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="group rounded-2xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#0a0a0c] p-6 hover:border-accent-start/30 transition-all duration-300 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(52,211,153,0.15)] hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity text-accent-start group-hover:scale-110 duration-500 pointer-events-none">
                <step.icon size={80} strokeWidth={1} />
              </div>
              
              <div className="relative z-10">
                {/* Neumorphic "depressed" button style for the icon */}
                <div className="w-12 h-12 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center mb-5 group-hover:bg-accent-start/10 transition-colors">
                  <step.icon size={20} className="text-accent-start" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminology Dictionary - Soft Skeuomorphic List */}
      <div>
        <h3 className="text-lg font-bold text-white mb-5 ml-1">Terminology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TERMINOLOGY.map((item) => (
            <div 
              key={item.term} 
              className="rounded-xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#0a0a0c] p-5 hover:border-accent-start/20 transition-all duration-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_8px_16px_rgba(0,0,0,0.4)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <span className="text-sm font-extrabold text-accent-start w-32 shrink-0">{item.term}</span>
                <span className="text-sm text-zinc-300 leading-relaxed">{item.definition}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}