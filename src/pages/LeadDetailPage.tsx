import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  Shield,
  Smartphone,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { useLead, useUpdateLead } from "../hooks/useApi";
import ScoreBadge from "../components/ScoreBadge";
import StatusBadge from "../components/StatusBadge";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import toast from "react-hot-toast";

function BoolIcon({ value }: { value: boolean | null | undefined }) {
  if (value === true) return <CheckCircle size={14} className="text-emerald-400" />;
  if (value === false) return <XCircle size={14} className="text-red-400" />;
  return <span className="text-text-muted text-xs">--</span>;
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

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBox message={(error as Error).message} />;
  if (!lead) return <ErrorBox message="Lead not found" />;

  return (
    <div>
      <Link
        to="/leads"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4"
      >
        <ArrowLeft size={16} />
        Back to Leads
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-border-default bg-surface-card p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">{lead.business_name}</h2>
            <p className="text-sm text-text-secondary mt-1">
              {lead.category} &middot; {lead.city}, {lead.country}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ScoreBadge value={lead.lead_score} />
            <StatusBadge status={lead.status} />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <label className="text-sm text-text-secondary">Change status:</label>
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-lg border border-border-default bg-surface-elevated px-3 py-1.5 text-sm text-text-secondary outline-none cursor-pointer"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="rounded-xl border border-border-default bg-surface-card p-5">
          <h3 className="text-sm font-medium text-text-secondary mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-text-muted shrink-0" />
              <div>
                <p className="text-sm text-text-primary">{lead.phone_e164 || "--"}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-text-muted">Valid:</span>
                  <BoolIcon value={lead.phone_valid} />
                  {lead.phone_type && (
                    <span className="text-xs text-text-muted ml-1">{lead.phone_type}</span>
                  )}
                  <span className="text-xs text-text-muted ml-1">
                    Confidence: {lead.phone_confidence}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={16} className="text-text-muted shrink-0" />
              <div>
                <p className="text-sm text-text-primary">{lead.email || "--"}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-text-muted">Valid:</span>
                  <BoolIcon value={lead.email_valid} />
                  {lead.email_catchall && (
                    <span className="text-xs text-amber-400 ml-1">catch-all</span>
                  )}
                  {lead.email_disposable && (
                    <span className="text-xs text-red-400 ml-1">disposable</span>
                  )}
                  <span className="text-xs text-text-muted ml-1">
                    Confidence: {lead.email_confidence}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Globe size={16} className="text-text-muted shrink-0" />
              <div>
                {lead.website_url ? (
                  <a
                    href={lead.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent-start hover:underline inline-flex items-center gap-1"
                  >
                    {lead.website_domain || lead.website_url.replace(/^https?:\/\//, "")}
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <p className="text-sm text-text-primary">--</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-text-muted shrink-0" />
              <p className="text-sm text-text-primary">{lead.address || "--"}</p>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="rounded-xl border border-border-default bg-surface-card p-5">
          <h3 className="text-sm font-medium text-text-secondary mb-4">Technical Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-text-muted shrink-0" />
              <span className="text-sm text-text-secondary">SSL:</span>
              <BoolIcon value={lead.has_ssl} />
            </div>
            <div className="flex items-center gap-3">
              <Smartphone size={16} className="text-text-muted shrink-0" />
              <span className="text-sm text-text-secondary">Mobile Friendly:</span>
              <BoolIcon value={lead.is_mobile_friendly} />
            </div>

            {lead.tech_stack && Object.keys(lead.tech_stack).length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-text-muted mb-2 uppercase tracking-wider">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(lead.tech_stack).map(([key, val]) => (
                    <span
                      key={key}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg bg-surface-hover text-xs text-text-secondary"
                    >
                      {key}: {val}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Source & Metadata */}
        <div className="lg:col-span-2 rounded-xl border border-border-default bg-surface-card p-5">
          <h3 className="text-sm font-medium text-text-secondary mb-4">Source & Metadata</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-text-muted">Sources</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {lead.source?.map((s) => {
                  const url = lead.source_urls?.[s];
                  return url ? (
                    <a
                      key={s}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-hover text-xs text-accent-start hover:underline"
                    >
                      {s} <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span
                      key={s}
                      className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-hover text-xs text-text-secondary"
                    >
                      {s}
                    </span>
                  );
                }) || "--"}
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted">Category</p>
              <p className="text-sm text-text-primary mt-0.5">{lead.category || "--"}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Created</p>
              <p className="text-sm text-text-primary mt-0.5">
                {new Date(lead.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Updated</p>
              <p className="text-sm text-text-primary mt-0.5">
                {new Date(lead.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
