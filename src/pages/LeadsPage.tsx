import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, ExternalLink, Search } from "lucide-react";
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
  });
  const [cityInput, setCityInput] = useState("");
  const { data, isLoading, error } = useLeads(filters);
  const updateLead = useUpdateLead();

  function applyCity() {
    setFilters((prev) => ({ ...prev, city: cityInput || undefined, page: 1 }));
  }

  function handleFilter(key: keyof LeadFilters, value: string) {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1,
    }));
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
  const meta = data?.meta;

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
        <select
          value={filters.status || ""}
          onChange={(e) => handleFilter("status", e.target.value)}
          className="rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary outline-none cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={filters.score_gte?.toString() || ""}
          onChange={(e) => handleFilter("score_gte", e.target.value)}
          className="rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary outline-none cursor-pointer"
        >
          <option value="">All Scores</option>
          <option value="70">Hot (70+)</option>
          <option value="40">Warm (40+)</option>
          <option value="0">All (0+)</option>
        </select>
        <div className="flex">
          <input
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyCity()}
            placeholder="City"
            className="rounded-l-lg border border-r-0 border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none w-40 focus:border-accent-start transition-colors"
          />
          <button
            onClick={applyCity}
            className="px-2.5 rounded-r-lg border border-border-default bg-surface-hover text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="Search city"
          >
            <Search size={14} />
          </button>
        </div>
      </div>

      {/* Total count */}
      {meta && (
        <p className="text-xs text-text-muted mb-3">
          {meta.total.toLocaleString()} lead{meta.total !== 1 ? "s" : ""} found
        </p>
      )}

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
                  <Link
                    to={`/leads/${lead.id}`}
                    className="font-medium text-text-primary hover:text-accent-start transition-colors"
                  >
                    {lead.business_name}
                  </Link>
                  {lead.website_url && (
                    <a
                      href={lead.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-accent-start hover:underline truncate max-w-[200px]"
                    >
                      {lead.website_url.replace(/^https?:\/\//, "")}
                      <ExternalLink size={10} />
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  {lead.phone_e164 || <span className="text-text-muted">--</span>}
                </td>
                <td className="px-4 py-3 text-text-secondary truncate max-w-[180px]">
                  {lead.email || <span className="text-text-muted">--</span>}
                </td>
                <td className="px-4 py-3 text-text-secondary">{lead.city}</td>
                <td className="px-4 py-3 text-center">
                  <ScoreBadge value={lead.lead_score} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {lead.source?.map((s) => {
                      const url = lead.source_urls?.[s];
                      return url ? (
                        <a
                          key={s}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-accent-start hover:underline"
                        >
                          {s}
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span key={s} className="text-text-secondary">{s}</span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <select
                    value={lead.status}
                    onChange={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStatusChange(lead.id, e.target.value);
                    }}
                    className="rounded border border-border-default bg-surface-elevated px-2 py-1 text-xs text-text-secondary outline-none cursor-pointer"
                  >
                    <option value="new">new</option>
                    <option value="contacted">contacted</option>
                    <option value="qualified">qualified</option>
                    <option value="converted">converted</option>
                    <option value="closed">closed</option>
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
          <Link
            key={lead.id}
            to={`/leads/${lead.id}`}
            className="block rounded-xl border border-border-default bg-surface-card p-4 hover:border-accent-start/30 transition-colors"
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
            </div>
          </Link>
        ))}
        {leads.length === 0 && (
          <p className="text-sm text-text-secondary text-center py-12">No leads found</p>
        )}
      </div>

      <Pagination
        page={meta?.page || 1}
        totalPages={meta?.totalPages || 1}
        onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
      />
    </div>
  );
}
