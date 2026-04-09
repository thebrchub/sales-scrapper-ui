import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  Megaphone,
  ChevronRight,
  Users,
  Briefcase,
  Clock,
  RefreshCw,
  ShieldOff,
  Info
} from "lucide-react";
import { useCampaigns, useCreateCampaign } from "../hooks/useApi";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import toast from "react-hot-toast";

const SOURCES = [
  { id: "google_maps", label: "Google Maps", color: "text-blue-400" },
  { id: "yelp", label: "Yelp", color: "text-red-400" },
  { id: "yellow_pages", label: "Yellow Pages", color: "text-amber-400" },
  { id: "google_dorks", label: "Google Dorks", color: "text-emerald-400" },
  { id: "reddit", label: "Reddit", color: "text-orange-400" },
  { id: "new_domains", label: "New Domains", color: "text-purple-400" },
  { id: "linkedin", label: "LinkedIn", color: "text-sky-400" },
  { id: "justdial", label: "JustDial", color: "text-yellow-400" },
];

export default function CampaignsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useCampaigns(page, 10);
  const create = useCreateCampaign();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [sources, setSources] = useState<string[]>(["google_maps"]);
  const [cities, setCities] = useState("");
  const [categories, setCategories] = useState("");
  const [autoRescrape, setAutoRescrape] = useState(false);
  const [dropNoContact, setDropNoContact] = useState(false);

  function toggleSource(s: string) {
    setSources((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const result = await create.mutateAsync({
        name,
        sources,
        cities: cities.split(",").map((c: string) => c.trim()).filter(Boolean),
        categories: categories.split(",").map((c: string) => c.trim()).filter(Boolean),
        auto_rescrape: autoRescrape,
        drop_no_contact: dropNoContact,
      });
      toast.success("Campaign created");
      setShowForm(false);
      setName("");
      setCities("");
      setCategories("");
      setAutoRescrape(false);
      setDropNoContact(false);
      navigate(`/campaigns/${result.id}`);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  const campaigns = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-xl bg-accent-start/10 border border-accent-start/20 flex items-center justify-center">
              <Megaphone size={20} className="text-accent-start" />
            </div> */}
            Campaigns
          </h2>
          {meta && (
            <p className="text-sm text-zinc-400 mt-1.5 ">
              Managing {meta.total} active scraping engines
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
            showForm 
              ? "bg-zinc-800 text-white hover:bg-zinc-700 border border-white/10" 
              : "bg-gradient-to-r from-accent-start to-accent-end text-zinc-950 hover:opacity-90 hover:shadow-accent-start/20"
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "New Campaign"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-[#09090b]/80 backdrop-blur-xl p-6 sm:p-8 mb-8 shadow-2xl space-y-6 animate-in slide-in-from-top-4 fade-in duration-300"
        >
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Campaign Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:bg-black/60 focus:border-accent-start transition-all"
              placeholder="e.g. Plumbers in New York"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Data Sources</label>
            <div className="flex flex-wrap gap-2.5">
              {SOURCES.map((s) => {
                const isActive = sources.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSource(s.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                      isActive
                        ? "border-accent-start/50 bg-accent-start/10 text-accent-start shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                        : "border-white/10 bg-black/40 text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Target Cities <span className="text-zinc-500 font-normal ml-1">(comma separated)</span>
              </label>
              <input
                value={cities}
                onChange={(e) => setCities(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:bg-black/60 focus:border-accent-start transition-all"
                placeholder="New York, Chicago, Miami"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Niche / Categories <span className="text-zinc-500 font-normal ml-1">(comma separated)</span>
              </label>
              <input
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:bg-black/60 focus:border-accent-start transition-all"
                placeholder="Plumbers, Restaurants, Dentists"
              />
            </div>
          </div>

          <div className="flex items-start gap-2.5 mt-2 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl">
            <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              <strong className="text-amber-400 font-semibold">Spelling matters:</strong> The scraper handles upper/lowercase automatically, but it cannot auto-correct spelling mistakes. Please double-check your city and category names to ensure successful lead generation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-xl bg-black/40 border border-white/5">
            {/* HIDDEN FOR NOW: Auto Rescrape Feature 
            <label className="flex items-center gap-4 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={autoRescrape}
                  onChange={(e) => setAutoRescrape(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 rounded-full bg-zinc-800 border border-white/10 peer-checked:bg-accent-start peer-checked:border-accent-start transition-colors duration-300" />
                <div className="absolute left-1 w-4 h-4 rounded-full bg-zinc-400 peer-checked:bg-zinc-950 peer-checked:translate-x-4 transition-transform duration-300 shadow-sm" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <RefreshCw size={14} className="text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                  <span className="text-sm font-medium text-zinc-200">Auto Rescrape</span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">Re-run this campaign daily</p>
              </div>
            </label>

            <div className="hidden sm:block w-px bg-white/10" />
            */}

            <label className="flex items-center gap-4 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={dropNoContact}
                  onChange={(e) => setDropNoContact(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 rounded-full bg-zinc-800 border border-white/10 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-colors duration-300" />
                <div className="absolute left-1 w-4 h-4 rounded-full bg-zinc-400 peer-checked:bg-zinc-950 peer-checked:translate-x-4 transition-transform duration-300 shadow-sm" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <ShieldOff size={14} className="text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                  <span className="text-sm font-medium text-zinc-200">Drop No-Contact</span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">Discard leads missing both phone & email</p>
              </div>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={create.isPending}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-accent-start to-accent-end text-sm font-bold text-zinc-950 shadow-lg transition-all duration-200 hover:opacity-90 hover:shadow-accent-start/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {create.isPending ? <><Spinner /> <span>Initializing Engine...</span></> : "Launch Campaign"}
            </button>
          </div>
        </form>
      )}

      {isLoading && <div className="py-10"><Spinner /></div>}
      {error && <ErrorBox message={(error as Error).message} />}

      {!isLoading && !error && (
        <>
          {campaigns.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-[#09090b] p-16 text-center shadow-xl">
              <div className="w-20 h-20 rounded-3xl bg-white/5 mx-auto mb-6 flex items-center justify-center border border-white/5">
                <Megaphone className="text-zinc-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No active campaigns</h3>
              <p className="text-sm text-zinc-400 max-w-sm mx-auto">
                Configure your first data scraping campaign to start populating your lead database.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {campaigns.map((c: any) => {
              const pct = c.jobs_total > 0 ? Math.round((c.jobs_completed / c.jobs_total) * 100) : 0;

              return (
                <Link
                  key={c.id}
                  to={`/campaigns/${c.id}`}
                  className="group block rounded-2xl border border-white/10 bg-[#09090b] p-5 hover:border-accent-start/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(52,211,153,0.2)] transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white truncate group-hover:text-accent-start transition-colors">
                          {c.name}
                        </h3>
                        <StatusBadge status={c.status} />
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-zinc-500">
                        <span className="inline-flex items-center gap-1.5 text-zinc-300 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                          <Briefcase size={12} className="text-accent-start" />
                          {c.sources?.map((s: string) => s.replace(/_/g, " ")).join(", ")}
                        </span>
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-zinc-600" />{c.cities?.join(", ")}</span>
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-zinc-600" />{c.categories?.join(", ")}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 bg-black/40 p-3 rounded-xl border border-white/5 md:bg-transparent md:border-none md:p-0">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center justify-end gap-1.5 text-xs font-medium text-zinc-400 mb-1">
                          <Clock size={12} /> {c.jobs_completed} / {c.jobs_total} tasks
                        </div>
                        <div className="flex items-center justify-end gap-1.5 text-sm font-bold text-accent-start">
                          <Users size={14} /> {c.leads_found.toLocaleString()} leads
                        </div>
                      </div>

                      <div className="relative w-12 h-12 shrink-0">
                        <svg className="w-12 h-12 -rotate-90 drop-shadow-md" viewBox="0 0 44 44">
                          <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-zinc-800" />
                          <circle cx="22" cy="22" r="18" fill="none" stroke="url(#progressGrad)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 113} 113`} className="transition-all duration-1000 ease-out" />
                          <defs>
                            <linearGradient id="progressGrad">
                              <stop offset="0%" stopColor="var(--color-accent-start)" />
                              <stop offset="100%" stopColor="var(--color-accent-end)" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">{pct}%</span>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-start/20 transition-colors hidden md:flex">
                        <ChevronRight size={16} className="text-zinc-400 group-hover:text-accent-start transition-colors" />
                      </div>
                    </div>
                  </div>

                  {(c.auto_rescrape || c.drop_no_contact) && (
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                      {/* HIDDEN FOR NOW: Auto Rescrape Badge
                      {c.auto_rescrape && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent-start/10 border border-accent-start/20 text-[10px] font-semibold text-accent-start">
                          <RefreshCw size={10} /> Auto Rescrape
                        </span>
                      )}
                      */}
                      {c.drop_no_contact && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-400">
                          <ShieldOff size={10} /> Drop No-Contact
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 sm:hidden text-xs font-medium border-t border-white/5 pt-3">
                    <span className="text-zinc-400 flex items-center gap-1"><Clock size={12} /> {c.jobs_completed}/{c.jobs_total}</span>
                    <span className="text-accent-start flex items-center gap-1"><Users size={12} /> {c.leads_found.toLocaleString()} leads</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <Pagination page={meta?.page || 1} totalPages={meta?.totalPages || 1} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}