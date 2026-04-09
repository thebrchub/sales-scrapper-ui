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
 
} from "lucide-react";

const STEPS = [
  {
    icon: Megaphone,
    title: "1. Create a Campaign",
    description: "Select data sources, target cities, and business niches. The system automatically provisions the scraping jobs.",
  },
  {
    icon: Zap,
    title: "2. Automated Extraction",
    description: "The engine crawls your selected sources in the background, extracting phones, emails, and website data.",
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
  { term: "Campaign", definition: "A batch extraction task combining specific sources and locations." },
  { term: "Source", definition: "The data origin (e.g., Google Maps, Yelp, LinkedIn)." },
  { term: "Deduplication", definition: "Automatic merging of duplicate records found across different sources." },
  { term: "E.164", definition: "The international phone format (+1234567890) applied to all numbers." },
];

export default function AboutPage() {
  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-xl bg-accent-start/10 border border-accent-start/20 flex items-center justify-center">
            <BookOpen size={20} className="text-accent-start" />
          </div> */}
          About & User Guide
        </h2>
        <p className="text-sm text-zinc-400 mt-1.5 ">
          Everything you need to know to operate the lead generation engine.
        </p>
      </div>

      {/* Hero Overview */}
      <div className="rounded-3xl border border-white/10 bg-[#09090b] p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-start/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            {/* <Info size={20} className="text-accent-start" /> */}
            Platform Overview
          </h3>
          <p className="text-base text-zinc-300 leading-relaxed max-w-4xl">
            Leads Generator is an automated data extraction engine that pulls business records from multiple public sources. 
            It automatically validates contact information, scores leads based on conversion potential, and removes 
            duplicates to provide you with a clean, actionable pipeline.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 uppercase tracking-wider">
              <Shield size={14} className="text-accent-start" />
              Auto-Validated
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 uppercase tracking-wider">
              <Users size={14} className="text-accent-start" />
              Deduplicated
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 uppercase tracking-wider">
              <Settings size={14} className="text-accent-start" />
              Highly Configurable
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Grid */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-white mb-5 ml-1">Workflow Guide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="group rounded-2xl border border-white/10 bg-[#09090b] p-6 hover:border-accent-start/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(52,211,153,0.2)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-accent-start group-hover:scale-110 duration-500 pointer-events-none">
                <step.icon size={60} strokeWidth={1.5} />
              </div>
              
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-accent-start/10 border border-accent-start/20 flex items-center justify-center mb-4 group-hover:bg-accent-start/20 transition-colors">
                  <step.icon size={18} className="text-accent-start" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminology Dictionary */}
      <div>
        <h3 className="text-lg font-bold text-white mb-5 ml-1">Terminology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TERMINOLOGY.map((item) => (
            <div 
              key={item.term} 
              className="rounded-xl border border-white/5 bg-black/40 p-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <span className="text-sm font-bold text-accent-start w-32 shrink-0">{item.term}</span>
                <span className="text-sm text-zinc-300 leading-relaxed">{item.definition}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}