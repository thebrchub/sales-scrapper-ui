import { Activity, Clock, Save, HardDrive } from "lucide-react";

export default function SettingsPage() {
  return (
    // 👇 FIXED: Removed 'max-w-5xl' so it seamlessly fills the layout grid
    <div className="animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-xl bg-accent-start/10 border border-accent-start/20 flex items-center justify-center">
            <Settings size={20} className="text-accent-start" />
          </div> */}
          System Preferences
        </h2>
        <p className="text-sm text-zinc-400 mt-1.5">
          Configure extraction engine parameters and watchdog thresholds.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Watchdog Configuration Card */}
        <div className="rounded-3xl border border-white/10 bg-[#09090b] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent-start/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-accent-start" />
              Watchdog Engine
            </h3>
            <p className="text-xs text-zinc-500 mt-1">Controls the automated monitoring and memory management of the scraper.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Stale Threshold
              </label>
              <div className="relative">
                <input
                  type="number"
                  defaultValue={600}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:bg-black/60 focus:border-accent-start transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 uppercase tracking-wider">Sec</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Watchdog Interval
              </label>
              <div className="relative">
                <input
                  type="number"
                  defaultValue={120}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:bg-black/60 focus:border-accent-start transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 uppercase tracking-wider">Sec</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Max Retries
              </label>
              <div className="relative">
                <input
                  type="number"
                  defaultValue={3}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 pl-10 text-sm text-white outline-none focus:bg-black/60 focus:border-accent-start transition-all"
                />
                <Activity size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Drain Batch Size
              </label>
              <div className="relative">
                <input
                  type="number"
                  defaultValue={100}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 pl-10 text-sm text-white outline-none focus:bg-black/60 focus:border-accent-start transition-all"
                />
                <HardDrive size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Source Timeouts Card */}
        <div className="rounded-3xl border border-white/10 bg-[#09090b] p-6 sm:p-8 shadow-2xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-accent-start" />
              Extraction Timeouts
            </h3>
            <p className="text-xs text-zinc-500 mt-1">Maximum time allowed per source before the job is killed to prevent hanging.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { source: "Google Maps", timeout: 480 },
              { source: "Yelp", timeout: 180 },
              { source: "Yellow Pages", timeout: 180 },
              { source: "Google Dorks", timeout: 300 },
              { source: "Reddit", timeout: 120 },
              { source: "New Domains", timeout: 120 },
            ].map((item) => (
              <div key={item.source} className="bg-black/20 p-4 rounded-2xl border border-white/5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  {item.source}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue={item.timeout}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none focus:bg-black/60 focus:border-accent-start transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Sec</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-accent-start to-accent-end text-sm font-bold text-zinc-950 shadow-lg transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-accent-start/20 cursor-pointer">
            <Save size={18} />
            Save Configurations
          </button>
        </div>

      </div>
    </div>
  );
}