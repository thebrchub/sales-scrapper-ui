import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { useCampaigns, useCreateCampaign } from "../hooks/useApi";
import StatusBadge from "../components/StatusBadge";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import toast from "react-hot-toast";

const SOURCES = ["google_maps", "yelp", "yellow_pages", "google_dorks", "reddit", "new_domains"];

export default function CampaignsPage() {
  const { data, isLoading, error } = useCampaigns();
  const create = useCreateCampaign();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [sources, setSources] = useState<string[]>(["google_maps"]);
  const [cities, setCities] = useState("");
  const [categories, setCategories] = useState("");

  function toggleSource(s: string) {
    setSources((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await create.mutateAsync({
        name,
        sources,
        cities: cities.split(",").map((c) => c.trim()).filter(Boolean),
        categories: categories.split(",").map((c) => c.trim()).filter(Boolean),
      });
      toast.success("Campaign created");
      setShowForm(false);
      setName("");
      setCities("");
      setCategories("");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBox message={(error as Error).message} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Campaigns</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-accent-start to-accent-end text-sm font-medium text-surface transition-opacity hover:opacity-90 cursor-pointer"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "New Campaign"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border-default bg-surface-card p-5 mb-6 space-y-4"
        >
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Campaign Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-start transition-colors"
              placeholder="Plumbers in New York"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Sources</label>
            <div className="flex flex-wrap gap-2">
              {SOURCES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSource(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    sources.includes(s)
                      ? "border-accent-start/50 bg-accent-start/10 text-accent-start"
                      : "border-border-default bg-surface-elevated text-text-secondary hover:bg-surface-hover"
                  }`}
                >
                  {s.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Cities <span className="text-text-muted">(comma separated)</span>
            </label>
            <input
              value={cities}
              onChange={(e) => setCities(e.target.value)}
              required
              className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-start transition-colors"
              placeholder="New York, Chicago, Miami"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Categories <span className="text-text-muted">(comma separated)</span>
            </label>
            <input
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              required
              className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-start transition-colors"
              placeholder="Plumbers, Restaurants, Dentists"
            />
          </div>

          <button
            type="submit"
            disabled={create.isPending}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-accent-start to-accent-end text-sm font-medium text-surface transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
          >
            {create.isPending ? "Creating..." : "Create Campaign"}
          </button>
        </form>
      )}

      {/* Campaign List */}
      <div className="space-y-3">
        {data?.data?.length === 0 && (
          <p className="text-sm text-text-secondary py-10 text-center">No campaigns yet</p>
        )}
        {data?.data?.map((c) => (
          <Link
            key={c.id}
            to={`/campaigns/${c.id}`}
            className="block rounded-xl border border-border-default bg-surface-card p-4 hover:border-accent-start/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-medium text-text-primary">{c.name}</h3>
                <p className="text-xs text-text-secondary mt-1">
                  {c.cities?.join(", ")} &middot; {c.categories?.join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={c.status} />
                <span className="text-sm text-text-secondary">
                  {c.jobs_completed}/{c.jobs_total} jobs
                </span>
                <span className="text-sm font-medium text-accent-start">
                  {c.leads_found} leads
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
