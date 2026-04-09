import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, ExternalLink, Search,  Filter, ChevronDown } from "lucide-react";
import { useLeads, useUpdateLead } from "../hooks/useApi";
import { getExportUrl, getToken } from "../api/client";
import type { LeadFilters } from "../types";
import StatusBadge from "../components/StatusBadge";
import ScoreBadge from "../components/ScoreBadge";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import toast from "react-hot-toast";

// --- CUSTOM PREMIUM DROPDOWN COMPONENT ---
// This replaces the ugly native OS <select> menus with a fully styled React component
function CustomDropdown({ 
  value, 
  options, 
  onChange, 
  placeholder = "Select...", 
  align = "left",
  size = "md" 
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
  placeholder?: string;
  align?: "left" | "right";
  size?: "md" | "sm";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className={`flex items-center justify-between w-full min-w-[130px] rounded-xl border border-white/10 bg-black/50 text-zinc-200 hover:border-accent-start/50 focus:border-accent-start transition-colors outline-none ${
          size === "sm" ? "px-3 py-1.5 text-xs font-semibold" : "px-4 py-2.5 text-sm font-medium"
        }`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={size === "sm" ? 14 : 16} className={`ml-2 shrink-0 text-zinc-500 transition-transform duration-200 ${isOpen ? "rotate-180 text-accent-start" : ""}`} />
      </button>

      {isOpen && (
        <>
          {/* Invisible overlay to detect clicks outside the dropdown */}
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
          
          <div className={`absolute ${align === "right" ? "right-0" : "left-0"} top-full mt-2 min-w-[140px] rounded-xl border border-white/10 bg-[#12121a] shadow-2xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200`}>
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center px-4 py-2 transition-colors ${size === "sm" ? "text-xs" : "text-sm"} ${
                  value === opt.value
                    ? "bg-accent-start/15 text-accent-start font-bold border-l-2 border-accent-start"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
// -----------------------------------------


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

  if (isLoading) return <div className="py-20"><Spinner /></div>;
  if (error) return <ErrorBox message={(error as Error).message} />;

  const leads = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-xl bg-accent-start/10 border border-accent-start/20 flex items-center justify-center">
              <Database size={20} className="text-accent-start" />
            </div> */}
            Lead Database
          </h2>
          {meta && (
            <p className="text-sm text-zinc-400 mt-1.5 ">
              Showing <strong className="text-white">{meta.total.toLocaleString()}</strong> captured leads
            </p>
          )}
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer shadow-lg"
        >
          <Download size={16} className="text-accent-start" />
          Export CSV
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-white/10 bg-[#09090b]/80 backdrop-blur-xl p-4 mb-6 shadow-xl flex flex-col lg:flex-row lg:items-center gap-4 relative z-20">
        <div className="flex items-center gap-2 text-zinc-400 shrink-0 hidden lg:flex px-2">
          <Filter size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Custom Status Dropdown */}
          <CustomDropdown 
            value={filters.status || ""}
            onChange={(val) => handleFilter("status", val)}
            placeholder="All Statuses"
            options={[
              { value: "", label: "All Statuses" },
              { value: "new", label: "New" },
              { value: "contacted", label: "Contacted" },
              { value: "qualified", label: "Qualified" },
              { value: "converted", label: "Converted" },
              { value: "closed", label: "Closed" }
            ]}
          />
          
          {/* Custom Score Dropdown */}
          <CustomDropdown 
            value={filters.score_gte?.toString() || ""}
            onChange={(val) => handleFilter("score_gte", val)}
            placeholder="All Scores"
            options={[
              { value: "", label: "All Scores" },
              { value: "70", label: "Hot (70+)" },
              { value: "40", label: "Warm (40+)" },
              { value: "0", label: "Cold (All)" }
            ]}
          />

          <div className="flex w-full sm:w-auto flex-1 max-w-md">
            <input
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyCity()}
              placeholder="Filter by City..."
              className="w-full rounded-l-xl border border-r-0 border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-accent-start focus:ring-1 focus:ring-accent-start/50 transition-colors"
            />
            <button
              onClick={applyCity}
              className="px-4 rounded-r-xl border border-white/10 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer flex items-center justify-center"
              title="Search city"
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* NEW: Top Pagination (Only shows if there is more than 1 page) */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-end mb-4 relative z-10">
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
          />
        </div>
      )}

      {/* Desktop Data Grid */}
      <div className="hidden lg:block rounded-2xl border border-white/10 bg-[#09090b] shadow-2xl mb-8">
        <div className="overflow-x-auto overflow-y-visible pb-24 -mb-24">
          <table className="w-full text-sm text-left">
            <thead className="bg-black/60 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Business</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Location</th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-zinc-500">Score</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Source Links</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-zinc-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.map((lead: any) => (
                <tr
                  key={lead.id}
                  className="hover:bg-white/[0.02] transition-colors duration-150 group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/leads/${lead.id}`}
                      className="font-bold text-white hover:text-accent-start transition-colors block mb-1"
                    >
                      {lead.business_name}
                    </Link>
                    {lead.website_url && (
                      <a
                        href={lead.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-accent-start/80 hover:text-accent-start hover:underline truncate max-w-[200px]"
                      >
                        {lead.website_url.replace(/^https?:\/\/(www\.)?/, "")}
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-zinc-200 font-medium mb-1">{lead.phone_e164 || <span className="text-zinc-700">No Phone</span>}</div>
                    <div className="text-xs text-zinc-500 truncate max-w-[180px]">{lead.email || <span className="text-zinc-700">No Email</span>}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-300">
                    {lead.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <ScoreBadge value={lead.lead_score} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {lead.source?.map((s: string) => {
                        const url = lead.source_urls?.[s];
                        return url ? (
                          <a
                            key={s}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-accent-start hover:bg-accent-start/10 transition-colors"
                          >
                            {s.replace(/_/g, " ")}
                            <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span key={s} className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-zinc-500">
                            {s.replace(/_/g, " ")}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end">
                    {/* Custom Action Dropdown */}
                    <CustomDropdown 
                      value={lead.status}
                      onChange={(val) => handleStatusChange(lead.id, val)}
                      size="sm"
                      align="right"
                      options={[
                        { value: "new", label: "New" },
                        { value: "contacted", label: "Contacted" },
                        { value: "qualified", label: "Qualified" },
                        { value: "converted", label: "Converted" },
                        { value: "closed", label: "Closed" }
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {leads.length === 0 && (
            <div className="p-16 text-center border-t border-white/5">
              <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto mb-4 flex items-center justify-center">
                <Search className="text-zinc-500" size={28} />
              </div>
              <p className="text-zinc-300 font-bold text-lg">No leads found</p>
              <p className="text-sm text-zinc-500 mt-1">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4 mb-8">
        {leads.map((lead: any) => (
          <div
            key={lead.id}
            className="block rounded-2xl border border-white/10 bg-[#09090b] p-5 hover:border-accent-start/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(52,211,153,0.2)] transition-all duration-300 relative"
          >
            <Link to={`/leads/${lead.id}`} className="absolute inset-0 z-0" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3 pointer-events-none">
                <div className="pr-4">
                  <h3 className="font-bold text-white text-lg leading-tight mb-1">
                    {lead.business_name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                    <span className="text-accent-start/80">{lead.city}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span>{lead.source?.map((s: string) => s.replace(/_/g, " ")).join(", ")}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <ScoreBadge value={lead.lead_score} />
                </div>
              </div>
              
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 mb-4 pointer-events-none">
                <p className="text-sm text-zinc-200 font-medium mb-1">
                  {lead.phone_e164 || <span className="text-zinc-600 italic">No phone provided</span>}
                </p>
                <p className="text-xs text-zinc-400 truncate">
                  {lead.email || <span className="text-zinc-600 italic">No email provided</span>}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <StatusBadge status={lead.status} />
                
                {/* Custom Action Dropdown for Mobile */}
                <CustomDropdown 
                  value={lead.status}
                  onChange={(val) => handleStatusChange(lead.id, val)}
                  size="sm"
                  align="right"
                  options={[
                    { value: "new", label: "Set: New" },
                    { value: "contacted", label: "Set: Contacted" },
                    { value: "qualified", label: "Set: Qualified" },
                    { value: "converted", label: "Set: Converted" },
                    { value: "closed", label: "Set: Closed" }
                  ]}
                />
              </div>
            </div>
          </div>
        ))}
        {leads.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#09090b] p-12 text-center">
             <Search className="text-zinc-500 mx-auto mb-3" size={24} />
             <p className="text-zinc-400 text-sm">No leads match your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-center pb-4 relative z-10">
        <Pagination
          page={meta?.page || 1}
          totalPages={meta?.totalPages || 1}
          onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
        />
      </div>
    </div>
  );
}