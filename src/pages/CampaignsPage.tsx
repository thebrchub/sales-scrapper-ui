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
        cities: cities.split(",").map((c) => c.trim()).filter(Boolean),
        categories: categories.split(",").map((c) => c.trim()).filter(Boolean),
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
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-start/20 to-accent-end/20 flex items-center justify-center">
            <Megaphone size={20} className="text-accent-start" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Campaigns</h2>
            {meta && (
              <p className="text-xs text-text-muted">{meta.total} total</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-start to-accent-end text-sm font-medium text-surface transition-all hover:opacity-90 hover:shadow-lg hover:shadow-accent-start/20 cursor-pointer"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "New Campaign"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border-default bg-surface-card p-6 mb-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Campaign Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-border-default bg-surface-elevated px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-start focus:ring-1 focus:ring-accent-start/30 transition-all"
              placeholder="Plumbers in New York"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Sources
            </label>
            <div className="flex flex-wrap gap-2">
              {SOURCES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSource(s.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border-2 transition-all cursor-pointer ${
                    sources.includes(s.id)
                      ? "border-accent-start/50 bg-accent-start/10 text-accent-start shadow-sm shadow-accent-start/10"
                      : "border-border-default bg-surface-elevated text-text-secondary hover:bg-surface-hover hover:border-border-default/80"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Cities <span className="text-text-muted font-normal">(comma separated)</span>
              </label>
              <input
                value={cities}
                onChange={(e) => setCities(e.target.value)}
                required
                className="w-full rounded-xl border border-border-default bg-surface-elevated px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-start focus:ring-1 focus:ring-accent-start/30 transition-all"
                placeholder="New York, Chicago, Miami"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Categories <span className="text-text-muted font-normal">(comma separated)</span>
              </label>
              <input
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                required
                className="w-full rounded-xl border border-border-default bg-surface-elevated px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-start focus:ring-1 focus:ring-accent-start/30 transition-all"
                placeholder="Plumbers, Restaurants, Dentists"
              />
            </div>
          </div>

          {/* Config toggles */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-surface-hover/50 border border-border-subtle">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={autoRescrape}
                  onChange={(e) => setAutoRescrape(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 rounded-full bg-surface-elevated border border-border-default peer-checked:bg-accent-start/80 peer-checked:border-accent-start transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-text-muted peer-checked:bg-white peer-checked:translate-x-4 transition-all" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw size={13} className="text-text-muted group-hover:text-text-secondary" />
                  <span className="text-sm text-text-primary">Auto Rescrape</span>
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">Re-run this campaign daily</p>
              </div>
            </label>

            <div className="hidden sm:block w-px bg-border-default" />

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={dropNoContact}
                  onChange={(e) => setDropNoContact(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 rounded-full bg-surface-elevated border border-border-default peer-checked:bg-amber-500/80 peer-checked:border-amber-500 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-text-muted peer-checked:bg-white peer-checked:translate-x-4 transition-all" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <ShieldOff size={13} className="text-text-muted group-hover:text-text-secondary" />
                  <span className="text-sm text-text-primary">Drop No-Contact Leads</span>
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Discard leads missing both phone and email
                </p>
              </div>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={create.isPending}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-start to-accent-end text-sm font-medium text-surface transition-all hover:opacity-90 hover:shadow-lg hover:shadow-accent-start/20 disabled:opacity-60 cursor-pointer"
            >
              {create.isPending ? "Creating..." : "Create Campaign"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl border border-border-default text-sm text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Campaign List */}
      {isLoading && <Spinner />}
      {error && <ErrorBox message={(error as Error).message} />}

      {!isLoading && !error && (
        <>
          {campaigns.length === 0 && (
            <div className="rounded-2xl border border-border-default bg-surface-card p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-hover mx-auto mb-4 flex items-center justify-center">
                <Megaphone className="text-text-muted" size={28} />
              </div>
              <p className="text-text-secondary font-medium">No campaigns yet</p>
              <p className="text-sm text-text-muted mt-1">
                Create your first campaign to start generating leads
              </p>
            </div>
          )}

          <div className="space-y-3">
            {campaigns.map((c) => {
              const pct =
                c.jobs_total > 0
                  ? Math.round((c.jobs_completed / c.jobs_total) * 100)
                  : 0;

              return (
                <Link
                  key={c.id}
                  to={`/campaigns/${c.id}`}
                  className="group block rounded-2xl border border-border-default bg-surface-card p-5 hover:border-accent-start/30 hover:shadow-lg hover:shadow-accent-start/5 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left side */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3 className="font-semibold text-text-primary truncate group-hover:text-accent-start transition-colors">
                          {c.name}
                        </h3>
                        <StatusBadge status={c.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Briefcase size={11} />
                          {c.sources?.map((s) => s.replace(/_/g, " ")).join(", ")}
                        </span>
                        <span>&middot;</span>
                        <span>{c.cities?.join(", ")}</span>
                        <span>&middot;</span>
                        <span>{c.categories?.join(", ")}</span>
                      </div>
                    </div>

                    {/* Right side - stats */}
                    <div className="flex items-center gap-5 shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1.5 text-xs text-text-muted">
                          <Clock size={11} />
                          {c.jobs_completed}/{c.jobs_total} jobs
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-accent-start font-medium mt-0.5">
                          <Users size={11} />
                          {c.leads_found.toLocaleString()} leads
                        </div>
                      </div>

                      {/* Progress circle */}
                      <div className="relative w-11 h-11">
                        <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                          <circle
                            cx="22"
                            cy="22"
                            r="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-surface-hover"
                          />
                          <circle
                            cx="22"
                            cy="22"
                            r="18"
                            fill="none"
                            stroke="url(#progressGrad)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${(pct / 100) * 113} 113`}
                          />
                          <defs>
                            <linearGradient id="progressGrad">
                              <stop offset="0%" stopColor="var(--color-accent-start)" />
                              <stop offset="100%" stopColor="var(--color-accent-end)" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-text-primary">
                          {pct}%
                        </span>
                      </div>

                      <ChevronRight
                        size={18}
                        className="text-text-muted group-hover:text-accent-start transition-colors hidden sm:block"
                      />
                    </div>
                  </div>

                  {/* Mobile stats row */}
                  <div className="flex items-center justify-between mt-3 sm:hidden text-xs">
                    <span className="text-text-muted">
                      {c.jobs_completed}/{c.jobs_total} jobs
                    </span>
                    <span className="text-accent-start font-medium">
                      {c.leads_found.toLocaleString()} leads
                    </span>
                  </div>

                  {/* Config badges */}
                  <div className="flex items-center gap-2 mt-2.5">
                    {c.auto_rescrape && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent-start/10 text-[10px] font-medium text-accent-start">
                        <RefreshCw size={9} />
                        Auto Rescrape
                      </span>
                    )}
                    {c.drop_no_contact && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-[10px] font-medium text-amber-400">
                        <ShieldOff size={9} />
                        Drop No-Contact
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          <Pagination
            page={meta?.page || 1}
            totalPages={meta?.totalPages || 1}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
