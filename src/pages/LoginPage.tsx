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
      <img 
        src="/bg_login3.jpg" 
        alt="green neurons" 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Screen Overlay - Replaces the image opacity to ensure text remains readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-0 pointer-events-none" />

      {/* Main container - Added sm:max-w-[420px] for better mobile scaling */}
      <div className="w-full max-w-[380px] sm:max-w-[420px] relative z-10">
        
        {/* Header Section with dedicated text-backdrop */}
        <div className="text-center mb-8 sm:mb-10 relative">
          {/* Subtle blurred black gradient directly behind text for maximum readability */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-black/60 blur-2xl -z-10 rounded-[100%]" />
          
          <p className="text-[10px] sm:text-[11px] text-zinc-300 font-bold tracking-[0.3em] uppercase drop-shadow-md relative z-10">
            BRC HUB LLP's
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent pb-1 drop-shadow-lg relative z-10 mt-1">
            Leads Generator
          </h1>
        </div>

        {/* Premium Glassmorphism Form - Responsive padding (p-6 to sm:p-8) */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] space-y-5 sm:space-y-6"
        >
          {error && (
            <div className="flex items-start gap-3 rounded-xl bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 text-xs sm:text-sm p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-zinc-200 drop-shadow-sm">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="admin@brchub.com"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:bg-black/60 focus:ring-1 focus:ring-accent-start/10 focus:border-accent-start transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-medium text-zinc-200 drop-shadow-sm">
                Password
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:bg-black/60 focus:ring-1 focus:ring-accent-start/10 focus:border-accent-start transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-accent-start to-accent-end py-3 sm:py-3.5 text-sm font-bold text-zinc-950 shadow-lg transition-all duration-200 hover:opacity-90 hover:shadow-accent-start/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Authenticating...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}