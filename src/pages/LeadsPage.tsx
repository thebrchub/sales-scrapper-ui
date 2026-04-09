import { useState } from "react";
import { Download, Search } from "lucide-react";
import { useLeads, useUpdateLead } from "../hooks/useApi";
import { getExportUrl, getToken } from "../api/client";
import type { LeadFilters } from "../types";
import StatusBadge from "../components/StatusBadge";
import ScoreBadge from "../components/ScoreBadge";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import toast from "react-hot-toast";

export default function LeadsPage() {
  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    page_size: 25,
    sort: "-lead_score",
  });
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useLeads(filters);
  const updateLead = useUpdateLead();

  function handleFilter(key: keyof LeadFilters, value: string) {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1,
    }));
  }

  function handleSearch() {
    setFilters((prev) => ({ ...prev, search: search || undefined, page: 1 }));
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateLead.mutateAsync({ id, data: { status: status as "new" } });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update");
    }
  }

  function handleExport() {
    const params: Record<string, string> = {};
    if (filters.city) params.city = filters.city;
    if (filters.score_gte != null) params.score_gte = String(filters.score_gte);
    if (filters.status) params.status = filters.status;
    const token = getToken();
    if (token) params.token = token;
    window.open(getExportUrl(params), "_blank");
  }

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBox message={(error as Error).message} />;

  const leads = data?.data || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Leads</h2>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-default bg-surface-card text-sm text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search businesses..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border-default bg-surface-elevated text-sm text-text-primary outline-none focus:border-accent-start transition-colors"
          />
        </div>
        <select
          value={filters.status || ""}
          onChange={(e) => handleFilter("status", e.target.value)}
          className="rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary outline-none cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={filters.score_gte?.toString() || ""}
          onChange={(e) =>
            handleFilter("score_gte", e.target.value)
          }
          className="rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary outline-none cursor-pointer"
        >
          <option value="">All Scores</option>
          <option value="70">Hot (70+)</option>
          <option value="40">Warm (40+)</option>
          <option value="0">All (0+)</option>
        </select>
        <input
          value={filters.city || ""}
          onChange={(e) => handleFilter("city", e.target.value)}
          placeholder="City"
          className="rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none w-32 focus:border-accent-start transition-colors"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-xl border border-border-default bg-surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default">
              <th className="px-4 py-3 text-left text-text-secondary font-medium">Business</th>
              <th className="px-4 py-3 text-left text-text-secondary font-medium">Phone</th>
              <th className="px-4 py-3 text-left text-text-secondary font-medium">Email</th>
              <th className="px-4 py-3 text-left text-text-secondary font-medium">City</th>
              <th className="px-4 py-3 text-center text-text-secondary font-medium">Score</th>
              <th className="px-4 py-3 text-left text-text-secondary font-medium">Status</th>
              <th className="px-4 py-3 text-left text-text-secondary font-medium">Source</th>
              <th className="px-4 py-3 text-right text-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-border-subtle last:border-0 hover:bg-surface-hover/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-text-primary">{lead.business_name}</div>
                  {lead.website_url && (
                    <a
                      href={lead.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent-start hover:underline truncate block max-w-[200px]"
                    >
                      {lead.website_url.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  {lead.phone_e164 || <span className="text-text-muted">—</span>}
                </td>
                <td className="px-4 py-3 text-text-secondary truncate max-w-[180px]">
                  {lead.email || <span className="text-text-muted">—</span>}
                </td>
                <td className="px-4 py-3 text-text-secondary">{lead.city}</td>
                <td className="px-4 py-3 text-center">
                  <ScoreBadge value={lead.lead_score} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 text-text-secondary text-xs">
                  {lead.source?.join(", ")}
                </td>
                <td className="px-4 py-3 text-right">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className="rounded border border-border-default bg-surface-elevated px-2 py-1 text-xs text-text-secondary outline-none cursor-pointer"
                  >
                    <option value="new">new</option>
                    <option value="contacted">contacted</option>
                    <option value="converted">converted</option>
                    <option value="rejected">rejected</option>
                  </select>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-text-secondary">
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="rounded-xl border border-border-default bg-surface-card p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-text-primary text-sm">
                  {lead.business_name}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  {lead.city} &middot; {lead.source?.join(", ")}
                </p>
              </div>
              <ScoreBadge value={lead.lead_score} />
            </div>
            {lead.phone_e164 && (
              <p className="text-xs text-text-secondary">{lead.phone_e164}</p>
            )}
            {lead.email && (
              <p className="text-xs text-text-secondary truncate">{lead.email}</p>
            )}
            <div className="flex items-center justify-between mt-3">
              <StatusBadge status={lead.status} />
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                className="rounded border border-border-default bg-surface-elevated px-2 py-1 text-xs text-text-secondary outline-none cursor-pointer"
              >
                <option value="new">new</option>
                <option value="contacted">contacted</option>
                <option value="converted">converted</option>
                <option value="rejected">rejected</option>
              </select>
            </div>
          </div>
        ))}
        {leads.length === 0 && (
          <p className="text-sm text-text-secondary text-center py-12">No leads found</p>
        )}
      </div>

      <Pagination
        page={data?.page || 1}
        totalPages={data?.total_pages || 1}
        onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
      />
    </div>
  );
}
