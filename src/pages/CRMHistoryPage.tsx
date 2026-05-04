import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import type { LeadActivity, PaginatedResponse } from "../types";
import Spinner from "../components/Spinner";
import Tooltip from "../components/Tooltip";
import { Phone, Mail, Globe, ExternalLink } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  contacted: "bg-blue-500/20 text-blue-400",
  follow_up: "bg-purple-500/20 text-purple-400",
  interested: "bg-green-500/20 text-green-400",
  converted: "bg-emerald-500/20 text-emerald-400",
  not_interested: "bg-red-500/20 text-red-400",
  closed: "bg-zinc-500/20 text-zinc-400",
};

export default function CRMHistoryPage() {
  const [leads, setLeads] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchHistory = useCallback(() => {
    setLoading(true);
    api.get<PaginatedResponse<LeadActivity>>(`/crm/leads/history?page=${page}&page_size=20`)
      .then((res) => {
        setLeads(res.data || []);
        setTotal(res.meta.total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  if (loading && leads.length === 0) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">{error}</div>
      </div>
    );
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="w-full animate-in fade-in duration-500 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">History</h1>
        <p className="text-zinc-400 text-sm mt-1.5">Leads you've already contacted or completed ({total} total)</p>
      </div>

      <div className="rounded-3xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#09090b] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-black/30">
              <tr className="border-b border-white/5 text-zinc-400 text-left">
                <th className="px-6 py-4 font-medium">Business</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">City</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Notes</th>
                <th className="px-6 py-4 font-medium">Last Contact</th>
                <th className="px-6 py-4 font-medium">Next Follow Up</th>
                <th className="px-6 py-4 font-medium">Website</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.activity_id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{lead.business_name}</td>
                  <td className="px-6 py-4">
                    {lead.phone_e164 ? (
                      <a href={`tel:${lead.phone_e164}`} className="text-cyan-400 hover:underline flex items-center gap-1">
                        <Phone size={12} /> {lead.phone_e164}
                      </a>
                    ) : <span className="text-zinc-600">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    {lead.email ? (
                      <a href={`mailto:${lead.email}`} className="text-orange-400 hover:underline flex items-center gap-1">
                        <Mail size={12} /> {lead.email}
                      </a>
                    ) : <span className="text-zinc-600">—</span>}
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{lead.city}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status] || "bg-zinc-500/20 text-zinc-400"}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 max-w-[240px]">
                    <span className="group relative inline-block max-w-full truncate align-bottom">
                      {lead.notes || "—"}
                      {lead.notes && <Tooltip label={lead.notes} />}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-xs">
                    {lead.last_contact ? new Date(lead.last_contact).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-xs">
                    {lead.next_follow_up ? new Date(lead.next_follow_up).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {lead.website_url ? (
                      <a href={lead.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                        <Globe size={12} /> <ExternalLink size={10} />
                      </a>
                    ) : <span className="text-zinc-600">—</span>}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-20 text-center text-zinc-500">
                    No history yet. Start contacting your assigned leads!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 text-zinc-300 hover:bg-white/5 disabled:opacity-30"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 text-zinc-300 hover:bg-white/5 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
