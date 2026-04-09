import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  Shield,
  Smartphone,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Tags,
  ChevronDown,
  Database
} from "lucide-react";
import { useLead, useUpdateLead } from "../hooks/useApi";
import ScoreBadge from "../components/ScoreBadge";
import StatusBadge from "../components/StatusBadge";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import toast from "react-hot-toast";

// Reuse the Custom Dropdown from the Leads page for consistency
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
        className={`flex items-center justify-between w-full min-w-[140px] rounded-xl border border-white/10 bg-black/50 text-zinc-200 hover:border-accent-start/50 focus:border-accent-start transition-colors outline-none ${
          size === "sm" ? "px-3 py-1.5 text-xs font-semibold" : "px-4 py-2.5 text-sm font-medium"
        }`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={size === "sm" ? 14 : 16} className={`ml-2 shrink-0 text-zinc-500 transition-transform duration-200 ${isOpen ? "rotate-180 text-accent-start" : ""}`} />
      </button>

      {isOpen && (
        <>
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

function BoolIcon({ value }: { value: boolean | null | undefined }) {
  if (value === true) return <CheckCircle2 size={16} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" />;
  if (value === false) return <XCircle size={16} className="text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]" />;
  return <span className="text-zinc-600 text-xs font-medium">Unknown</span>;
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: lead, isLoading, error } = useLead(id!);
  const updateLead = useUpdateLead();

  async function handleStatusChange(status: string) {
    try {
      await updateLead.mutateAsync({ id: id!, data: { status: status as "new" } });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update");
    }
  }

  if (isLoading) return <div className="py-20"><Spinner /></div>;
  if (error) return <ErrorBox message={(error as Error).message} />;
  if (!lead) return <ErrorBox message="Lead not found" />;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Premium Back Navigation */}
      <Link
        to="/leads"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-6 group"
      >
        <div className="p-1.5 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        </div>
        Back to Database
      </Link>

      {/* Hero Header */}
      <div className="rounded-3xl border border-white/10 bg-[#09090b] p-6 sm:p-8 mb-6 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-start/5 blur-[100px] rounded-full pointer-events-none" />

        {/* 👇 2. Wrapped the ambient glow in its own dedicated clipping box */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-start/5 blur-[100px] rounded-full" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {/* <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <Building2 size={24} className="text-accent-start" />
              </div> */}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {lead.business_name}
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mt-4">
              {lead.city && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-zinc-300">
                  <MapPin size={14} className="text-accent-start" />
                  {lead.city}{lead.country ? `, ${lead.country}` : ''}
                </div>
              )}
              {lead.category && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-zinc-300">
                  <Tags size={14} className="text-accent-start" />
                  {lead.category}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center md:items-end lg:items-center gap-4 shrink-0 bg-black/40 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <ScoreBadge value={lead.lead_score} />
              <StatusBadge status={lead.status} />
            </div>
            <div className="hidden sm:block md:hidden lg:block w-px h-8 bg-white/10" />
            <div className="w-full sm:w-auto">
              <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">Update Status</p>
              <CustomDropdown 
                value={lead.status}
                onChange={handleStatusChange}
                size="sm"
                options={[
                  { value: "new", label: "New" },
                  { value: "contacted", label: "Contacted" },
                  { value: "qualified", label: "Qualified" },
                  { value: "converted", label: "Converted" },
                  { value: "closed", label: "Closed" }
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Contact Info Card */}
        <div className="rounded-3xl border border-white/10 bg-[#09090b] p-6 sm:p-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Phone size={18} className="text-accent-start" /> Contact Information
          </h3>
          
          <div className="space-y-6">
            <div className="group p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-accent-start/30 transition-colors">
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-zinc-500 group-hover:text-accent-start transition-colors shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-lg font-bold text-white tracking-tight">{lead.phone_e164 || <span className="text-zinc-600 italic text-base">No phone available</span>}</p>
                  {lead.phone_e164 && (
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2">
                      <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                        <span className="text-xs text-zinc-400 font-medium">Valid:</span>
                        <BoolIcon value={lead.phone_valid} />
                      </div>
                      {lead.phone_type && (
                        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                          <span className="text-xs text-zinc-400 font-medium">Type:</span>
                          <span className="text-xs font-bold text-zinc-200 capitalize">{lead.phone_type}</span>
                        </div>
                      )}
                      {lead.phone_confidence && (
                        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                          <span className="text-xs text-zinc-400 font-medium">Confidence:</span>
                          <span className="text-xs font-bold text-accent-start">{lead.phone_confidence}%</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="group p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-accent-start/30 transition-colors">
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-zinc-500 group-hover:text-accent-start transition-colors shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-white tracking-tight truncate">{lead.email || <span className="text-zinc-600 italic text-base">No email available</span>}</p>
                  {lead.email && (
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2">
                      <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                        <span className="text-xs text-zinc-400 font-medium">Valid:</span>
                        <BoolIcon value={lead.email_valid} />
                      </div>
                      {(lead.email_catchall || lead.email_disposable) && (
                        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                          <span className="text-xs text-zinc-400 font-medium">Flags:</span>
                          {lead.email_catchall && <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">Catch-all</span>}
                          {lead.email_disposable && <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">Disposable</span>}
                        </div>
                      )}
                      {lead.email_confidence && (
                        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                          <span className="text-xs text-zinc-400 font-medium">Confidence:</span>
                          <span className="text-xs font-bold text-accent-start">{lead.email_confidence}%</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="group p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-accent-start/30 transition-colors">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-zinc-500 group-hover:text-accent-start transition-colors shrink-0" />
                <div className="flex-1 min-w-0">
                  {lead.website_url ? (
                    <a
                      href={lead.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-accent-start hover:text-white transition-colors inline-flex items-center gap-2"
                    >
                      {lead.website_domain || lead.website_url.replace(/^https?:\/\/(www\.)?/, "")}
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <p className="text-base text-zinc-600 italic font-bold">No website available</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-zinc-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-zinc-300 leading-relaxed">{lead.address || <span className="text-zinc-600 italic">No full address available</span>}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Info Card */}
        <div className="rounded-3xl border border-white/10 bg-[#09090b] p-6 sm:p-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Smartphone size={18} className="text-accent-start" /> Technical Footprint
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <Shield size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">SSL Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <BoolIcon value={lead.has_ssl} />
                  <span className="text-sm font-semibold text-white">{lead.has_ssl ? "Secured" : lead.has_ssl === false ? "Insecure" : "Unknown"}</span>
                </div>
              </div>
              
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <Smartphone size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Mobile Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <BoolIcon value={lead.is_mobile_friendly} />
                  <span className="text-sm font-semibold text-white">{lead.is_mobile_friendly ? "Optimized" : lead.is_mobile_friendly === false ? "Not Optimized" : "Unknown"}</span>
                </div>
              </div>
            </div>

            {lead.tech_stack && Object.keys(lead.tech_stack).length > 0 ? (
              <div className="bg-black/40 border border-white/5 p-5 rounded-2xl mt-4">
                <p className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Database size={14} /> Detected Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(lead.tech_stack).map(([key, val]) => (
                    <div
                      key={key}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                    >
                      <span className="text-xs font-bold text-zinc-400 capitalize">{key}:</span>
                      <span className="text-xs font-semibold text-accent-start">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-black/40 border border-white/5 p-5 rounded-2xl mt-4 text-center">
                <Database size={24} className="text-zinc-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-zinc-500">No specific technologies detected.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Source & Metadata Full Width Card */}
      <div className="rounded-3xl border border-white/10 bg-[#09090b] p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white mb-6">Database Metadata</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
            <p className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Acquisition Sources</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {lead.source?.map((s: string) => {
                const url = lead.source_urls?.[s];
                return url ? (
                  <a
                    key={s}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-bold text-accent-start hover:bg-accent-start/20 hover:border-accent-start/30 transition-all"
                  >
                    {s.replace(/_/g, " ")} <ExternalLink size={10} />
                  </a>
                ) : (
                  <span
                    key={s}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 capitalize"
                  >
                    {s.replace(/_/g, " ")}
                  </span>
                );
              }) || <span className="text-zinc-500 italic text-sm">No source recorded</span>}
            </div>
          </div>
          
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
            <p className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Classification</p>
            <p className="text-sm font-semibold text-white mt-1 capitalize">{lead.category || <span className="text-zinc-600 italic">Uncategorized</span>}</p>
          </div>
          
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
            <p className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Record Created</p>
            <p className="text-sm font-semibold text-white mt-1">
              {new Date(lead.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
            <p className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Last Modified</p>
            <p className="text-sm font-semibold text-white mt-1">
              {new Date(lead.updated_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}