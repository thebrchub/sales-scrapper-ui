import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import { LeadActivity, PaginatedResponse } from "../types";
import {
  Loader2, ChevronDown, ChevronUp, Phone, Mail, Globe,
  ExternalLink, ShieldCheck, Smartphone, MapPin, Tag
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "contacted", label: "Contacted", color: "bg-blue-500/20 text-blue-400" },
  { value: "follow_up", label: "Follow Up", color: "bg-purple-500/20 text-purple-400" },
  { value: "interested", label: "Interested", color: "bg-green-500/20 text-green-400" },
  { value: "converted", label: "Converted", color: "bg-emerald-500/20 text-emerald-400" },
  { value: "not_interested", label: "Not Interested", color: "bg-red-500/20 text-red-400" },
  { value: "closed", label: "Closed", color: "bg-zinc-500/20 text-zinc-400" },
];

function getStatusStyle(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.color ?? "bg-zinc-500/20 text-zinc-400";
}

export default function CRMLeadsPage() {
  const [leads, setLeads] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchLeads = useCallback(() => {
    setLoading(true);
    api.get<PaginatedResponse<LeadActivity>>(`/crm/leads?page=${page}`)
      .then((res) => {
        setLeads(res.data || []);
        setTotal(res.meta.total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function updateLead(activityId: string, updates: Record<string, string | null>) {
    setUpdating(activityId);
    try {
      await api.patch(`/crm/leads/${activityId}`, updates);
      fetchLeads();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUpdating(null);
    }
  }

  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Leads</h1>
          <p className="text-zinc-400 text-sm mt-1">{total} leads assigned to you</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-zinc-400 text-left">
                <th className="px-4 py-3 font-medium w-8"></th>
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Follow Up</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <LeadRow
                  key={lead.activity_id}
                  lead={lead}
                  expanded={expandedId === lead.activity_id}
                  onToggle={() => setExpandedId(expandedId === lead.activity_id ? null : lead.activity_id)}
                  onUpdate={updateLead}
                  updating={updating === lead.activity_id}
                />
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                    No leads assigned yet. Ask your admin to assign a campaign.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            Page {page} of {totalPages}
          </p>
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

interface LeadRowProps {
  lead: LeadActivity;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (id: string, updates: Record<string, string | null>) => void;
  updating: boolean;
}

function LeadRow({ lead, expanded, onToggle, onUpdate, updating }: LeadRowProps) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [nextAction, setNextAction] = useState(lead.next_action || "");
  const [nextFollowUp, setNextFollowUp] = useState(lead.next_follow_up?.slice(0, 16) || "");
  const [status, setStatus] = useState(lead.status);

  return (
    <>
      <tr
        className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <td className="px-4 py-3">
          {expanded ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
        </td>
        <td className="px-4 py-3 font-medium text-white">{lead.business_name}</td>
        <td className="px-4 py-3">
          {lead.phone_e164 ? (
            <a href={`tel:${lead.phone_e164}`} onClick={(e) => e.stopPropagation()} className="text-cyan-400 hover:underline flex items-center gap-1">
              <Phone size={12} /> {lead.phone_e164}
            </a>
          ) : (
            <span className="text-zinc-600">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          {lead.email ? (
            <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="text-orange-400 hover:underline flex items-center gap-1">
              <Mail size={12} /> {lead.email}
            </a>
          ) : (
            <span className="text-zinc-600">—</span>
          )}
        </td>
        <td className="px-4 py-3 text-zinc-300">{lead.city}</td>
        <td className="px-4 py-3 text-zinc-300">{lead.category}</td>
        <td className="px-4 py-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(lead.status)}`}>
            {lead.status}
          </span>
        </td>
        <td className="px-4 py-3 text-zinc-400 text-xs">
          {lead.next_follow_up ? new Date(lead.next_follow_up).toLocaleDateString() : "—"}
        </td>
      </tr>

      {/* Expanded Details */}
      {expanded && (
        <tr className="border-b border-white/5 bg-[#050505]">
          <td colSpan={8} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lead Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Lead Details</h4>
                <div className="space-y-2 text-sm">
                  {lead.website_url && (
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Globe size={14} className="text-zinc-500" />
                      <a href={lead.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                        {lead.website_url} <ExternalLink size={10} />
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-zinc-300">
                    <MapPin size={14} className="text-zinc-500" />
                    <span>{lead.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Tag size={14} className="text-zinc-500" />
                    <span>{lead.category}</span>
                  </div>
                  {lead.has_ssl !== null && (
                    <div className="flex items-center gap-2 text-zinc-300">
                      <ShieldCheck size={14} className={lead.has_ssl ? "text-green-400" : "text-red-400"} />
                      <span>SSL: {lead.has_ssl ? "Yes" : "No"}</span>
                    </div>
                  )}
                  {lead.is_mobile_friendly !== null && (
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Smartphone size={14} className={lead.is_mobile_friendly ? "text-green-400" : "text-red-400"} />
                      <span>Mobile Friendly: {lead.is_mobile_friendly ? "Yes" : "No"}</span>
                    </div>
                  )}
                  {lead.source?.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {lead.source.map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Update Form */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Update Activity</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 resize-none"
                      placeholder="Add notes about this lead..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Next Action</label>
                    <input
                      type="text"
                      value={nextAction}
                      onChange={(e) => setNextAction(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
                      placeholder="e.g. Call back, Send proposal..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Next Follow Up</label>
                    <input
                      type="datetime-local"
                      value={nextFollowUp}
                      onChange={(e) => setNextFollowUp(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate(lead.activity_id, {
                        status,
                        notes: notes || null,
                        next_action: nextAction || null,
                        next_follow_up: nextFollowUp ? new Date(nextFollowUp).toISOString() : null,
                      });
                    }}
                    disabled={updating}
                    className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
