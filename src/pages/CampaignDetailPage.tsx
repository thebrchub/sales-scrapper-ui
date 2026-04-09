import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCampaign, useCampaignJobs } from "../hooks/useApi";
import StatusBadge from "../components/StatusBadge";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: campaign, isLoading, error } = useCampaign(id!);
  const { data: jobsData } = useCampaignJobs(id!);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBox message={(error as Error).message} />;
  if (!campaign) return <ErrorBox message="Campaign not found" />;

  const jobs = jobsData?.data || [];
  const pct =
    campaign.jobs_total > 0
      ? Math.round((campaign.jobs_completed / campaign.jobs_total) * 100)
      : 0;

  return (
    <div>
      <Link
        to="/campaigns"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="rounded-xl border border-border-default bg-surface-card p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">{campaign.name}</h2>
            <p className="text-sm text-text-secondary mt-1">
              {campaign.cities?.join(", ")} &middot; {campaign.categories?.join(", ")}
            </p>
          </div>
          <StatusBadge status={campaign.status} />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-text-secondary">Progress</span>
            <span className="text-text-primary font-medium">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-hover overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-start to-accent-end transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-text-secondary mt-1.5">
            <span>
              {campaign.jobs_completed}/{campaign.jobs_total} jobs completed
            </span>
            <span className="text-accent-start font-medium">
              {campaign.leads_found} leads found
            </span>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <h3 className="text-sm font-medium text-text-secondary mb-3">Jobs</h3>

      {/* Desktop Table */}
      <div className="hidden sm:block rounded-xl border border-border-default bg-surface-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default">
              <th className="px-4 py-3 text-left text-text-secondary font-medium">Source</th>
              <th className="px-4 py-3 text-left text-text-secondary font-medium">Query</th>
              <th className="px-4 py-3 text-left text-text-secondary font-medium">Status</th>
              <th className="px-4 py-3 text-right text-text-secondary font-medium">Leads</th>
              <th className="px-4 py-3 text-right text-text-secondary font-medium">Attempts</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr
                key={j.id}
                className="border-b border-border-subtle last:border-0 hover:bg-surface-hover/50 transition-colors"
              >
                <td className="px-4 py-3 text-text-primary">{j.source}</td>
                <td className="px-4 py-3 text-text-secondary truncate max-w-[200px]">
                  {j.query}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={j.status} />
                </td>
                <td className="px-4 py-3 text-right text-text-primary">{j.leads_found}</td>
                <td className="px-4 py-3 text-right text-text-secondary">
                  {j.attempt_count}/{j.max_attempts}
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                  No jobs yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="sm:hidden space-y-3">
        {jobs.map((j) => (
          <div
            key={j.id}
            className="rounded-xl border border-border-default bg-surface-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">{j.source}</span>
              <StatusBadge status={j.status} />
            </div>
            <p className="text-xs text-text-secondary truncate">{j.query}</p>
            <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
              <span>{j.leads_found} leads</span>
              <span>
                {j.attempt_count}/{j.max_attempts} attempts
              </span>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <p className="text-sm text-text-secondary text-center py-8">No jobs yet</p>
        )}
      </div>
    </div>
  );
}
