import { useState, useEffect } from "react";

// Cycle through tech-oriented messages for a unique UX experience
const LOADING_MESSAGES = [
  "Initializing BRC HUB engine...",
  "Authenticating secure access...",
  "Preparing source queues...",
  "Pre-caching locations...",
  "Loading validation models...",
  "Booting extraction core...",
  "Stabilizing connection...",
];

export default function Spinner({ size = 192 }: { size?: number }) {
  const [messageIndex, setMessageIndex] = useState(0);

  // Smoothly cycle messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Calculate perfect scale based on the original 192px (w-48) design
  const scaleFactor = size / 192;

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[70vh] animate-in fade-in duration-300">
      
      {/* Background ambient glow effect - scales dynamically */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-start/5 blur-[120px] rounded-full pointer-events-none z-0" 
        style={{ width: size * 3, height: size * 3 }}
      />

      {/* 
        The Central Animated Assembly 
        We use CSS transform scale here so the internal layout never breaks, 
        regardless of what 'size' the backend passes!
      */}
      <div 
        className="relative w-48 h-48 flex items-center justify-center mb-10 z-10"
        style={{ transform: `scale(${scaleFactor})` }}
      >
        
        {/* Outer Rotating Ring (Clockwise) */}
        <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-spin duration-10000">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent-start/30 blur-sm" />
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-700" />
        </div>

        {/* Inner Rotating Ring (Counter-Clockwise) */}
        <div className="absolute inset-4 rounded-full border-t-2 border-r-2 border-accent-start/40 animate-spin-reverse">
          <div className="absolute top-10 left-0 w-2 h-2 rounded-full bg-accent-end" />
        </div>

        {/* The Core Pulsing Orb */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-accent-start to-accent-end animate-pulse-glow flex items-center justify-center overflow-hidden">
          
          {/* Internal Core "Intelligence" Glow */}
          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm relative overflow-hidden flex items-center justify-center shadow-inner">
             <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-50" />
             <span className="relative z-10 text-[10px] font-extrabold text-accent-start opacity-70 tracking-[0.2em] uppercase">BRC</span>
          </div>
          
          {/* RESTORED: Subtle Data Lines and Nodes */}
          <svg className="absolute inset-0 w-full h-full text-white/10" viewBox="0 0 100 100">
            <line x1="10" y1="10" x2="90" y2="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="90" y1="10" x2="10" y2="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
            <circle cx="50" cy="15" r="2" fill="currentColor" />
            <circle cx="85" cy="50" r="2" fill="currentColor" />
            <circle cx="50" cy="85" r="2" fill="currentColor" />
            <circle cx="15" cy="50" r="2" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* The Dynamic Loading Message */}
      <div className="relative z-10 text-center px-6">
        <p className="text-xl font-bold text-white tracking-tight">Preparing Pipeline</p>
        
        {/* Sliding message box */}
        <div className="h-6 overflow-hidden mt-1.5 flex justify-center">
          <p key={messageIndex} className="text-sm font-medium text-zinc-500 animate-in slide-in-from-bottom-2 fade-in duration-300">
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}