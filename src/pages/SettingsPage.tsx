import { Activity, Clock, Save, HardDrive, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
            <SettingsIcon size={18} className="text-accent-start" />
          </div>
          System Preferences
        </h2>
        <p className="text-sm text-zinc-400 mt-1.5 ml-14">
          Configure extraction engine parameters and watchdog thresholds.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Watchdog Configuration Card - Main Skeuomorphic Panel */}
        <div className="rounded-3xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#09090b] p-6 sm:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-start/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <Activity size={16} className="text-accent-start" />
              </div>
              Watchdog Engine
            </h3>
            <p className="text-sm text-zinc-400 mt-2 ml-13">
              Controls the automated monitoring and memory management of the scraper.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            <div>
              <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-2">
                Stale Threshold
              </label>
              <div className="relative">
                {/* Recessed Input */}
                <input
                  type="number"
                  defaultValue={600}
                  className="w-full rounded-xl border border-white/5 bg-[#09090b] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] px-4 py-3 text-sm font-bold text-white outline-none focus:bg-[#0c0c0e] focus:border-accent-start/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-accent-start uppercase tracking-wider">Sec</span>
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-2">
                Watchdog Interval
              </label>
              <div className="relative">
                {/* Recessed Input */}
                <input
                  type="number"
                  defaultValue={120}
                  className="w-full rounded-xl border border-white/5 bg-[#09090b] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] px-4 py-3 text-sm font-bold text-white outline-none focus:bg-[#0c0c0e] focus:border-accent-start/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-accent-start uppercase tracking-wider">Sec</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-2">
                Max Retries
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#121214] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center">
                  <Activity size={14} className="text-zinc-400" />
                </div>
                {/* Recessed Input */}
                <input
                  type="number"
                  defaultValue={3}
                  className="w-full rounded-xl border border-white/5 bg-[#09090b] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] px-4 py-3 pl-14 text-sm font-bold text-white outline-none focus:bg-[#0c0c0e] focus:border-accent-start/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-2">
                Drain Batch Size
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#121214] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center">
                  <HardDrive size={14} className="text-zinc-400" />
                </div>
                {/* Recessed Input */}
                <input
                  type="number"
                  defaultValue={100}
                  className="w-full rounded-xl border border-white/5 bg-[#09090b] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] px-4 py-3 pl-14 text-sm font-bold text-white outline-none focus:bg-[#0c0c0e] focus:border-accent-start/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Source Timeouts Card - Main Skeuomorphic Panel */}
        <div className="rounded-3xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#09090b] p-6 sm:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <Clock size={16} className="text-blue-400" />
              </div>
              Extraction Timeouts
            </h3>
            <p className="text-sm text-zinc-400 mt-2 ml-13">
              Maximum time allowed per source before the job is killed to prevent hanging.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
            {[
              { source: "Google Maps", timeout: 480 },
              { source: "Yelp", timeout: 180 },
              { source: "Yellow Pages", timeout: 180 },
              { source: "Google Dorks", timeout: 300 },
              { source: "Reddit", timeout: 120 },
              { source: "New Domains", timeout: 120 },
            ].map((item) => (
              // Individual Physical Module Cards
              <div key={item.source} className="bg-[#121214] p-5 rounded-2xl border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_10px_rgba(0,0,0,0.5)]">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mb-3">
                  {item.source}
                </label>
                <div className="relative">
                  {/* Deeply Recessed LCD-style Input */}
                  <input
                    type="number"
                    defaultValue={item.timeout}
                    className="w-full rounded-xl border border-white/5 bg-[#050505] shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)] px-4 py-3 text-sm font-black text-white outline-none focus:bg-black focus:border-accent-start/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-400 uppercase tracking-wider">Sec</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Footer - Protruding Action Button */}
        <div className="flex justify-end pt-4">
          <button className="flex items-center justify-center gap-2 px-10 py-3.5 rounded-xl bg-gradient-to-r from-accent-start to-accent-end text-sm font-extrabold text-zinc-950 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_16px_rgba(52,211,153,0.3)] transition-all duration-200 hover:opacity-90 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_12px_20px_rgba(52,211,153,0.4)] hover:-translate-y-0.5 cursor-pointer">
            <Save size={18} />
            Commit Configuration
          </button>
        </div>

      </div>
    </div>
  );
}