import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/client";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch {
      setError("Invalid credentials. Please try again."); 
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Background Image - Full opacity for maximum visual impact */}
      <video
        src="/bg_login3.mp4" 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        autoPlay
        loop
        muted
      />

      {/* Screen Overlay - Replaces the image opacity to ensure text remains readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-0 pointer-events-none" />

      {/* Main container */}
      <div className="w-full max-w-[380px] sm:max-w-[420px] relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-black/60 blur-2xl -z-10 rounded-[100%]" />
          
          <p className="text-[10px] sm:text-[11px] text-zinc-400 font-extrabold tracking-[0.3em] uppercase drop-shadow-md relative z-10">
            BRC HUB LLP's
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-start to-accent-end pb-1 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] relative z-10 mt-1">
            BRC Connect
          </h1>
        </div>

        {/* Skeuomorphic Main Panel */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b]/95 to-[#09090b]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.8)] space-y-6 animate-in slide-in-from-top-4 fade-in duration-300"
        >
          {error && (
            <div className="flex items-start gap-3 rounded-2xl bg-[#09090b] border border-red-500/20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] text-red-400 text-xs sm:text-sm p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
              <p className="font-bold mt-0.5">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest drop-shadow-sm ml-1">
              System Identifier
            </label>
            {/* Deeply Recessed Input */}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="admin@brchub.com"
              className="w-full rounded-xl border border-white/5 bg-[#050505] shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)] px-4 py-3.5 text-sm font-bold text-white placeholder:text-zinc-600 outline-none focus:bg-black focus:border-accent-start/50 transition-all duration-200"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest drop-shadow-sm ml-1">
              Authorization Key
            </label>
            {/* Deeply Recessed Input */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/5 bg-[#050505] shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)] px-4 py-3.5 text-sm font-bold text-white placeholder:text-zinc-600 outline-none focus:bg-black focus:border-accent-start/50 transition-all duration-200"
            />
          </div>

          {/* Protruding Skeuomorphic Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 rounded-xl bg-gradient-to-r from-accent-start to-accent-end py-3.5 text-sm font-extrabold text-zinc-950 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_16px_rgba(52,211,153,0.3)] transition-all duration-200 hover:opacity-90 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_12px_20px_rgba(52,211,153,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_16px_rgba(52,211,153,0.3)] disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Authenticating...</span>
              </>
            ) : (
              "Initialize Session"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
