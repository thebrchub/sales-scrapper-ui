import { AlertTriangle, RotateCcw, Trash2 } from "lucide-react";
import { useDeadJobs, useRetryJob } from "../hooks/useApi";
import StatusBadge from "../components/StatusBadge";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import toast from "react-hot-toast";

export default function DeadLetterPage() {
  const { data, isLoading, error } = useDeadJobs();
  const retry = useRetryJob();

  async function handleRetry(id: string) {
    try {
      await retry.mutateAsync(id);
      toast.success("Job re-queued");
    } catch {
      toast.error("Failed to retry job");
    }
  }

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBox message={(error as Error).message} />;

  const jobs = data?.data || [];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="text-danger" size={22} />
        <h2 className="text-xl font-semibold text-text-primary">Dead Letter Queue</h2>
        {jobs.length > 0 && (
          <span className="rounded-full bg-danger/15 text-danger text-xs font-medium px-2 py-0.5">
            {jobs.length}
          </span>
        )}
      </div>

      {jobs.length === 0 && (
        <div className="rounded-xl border border-border-default bg-surface-card p-12 text-center">
          <Trash2 className="mx-auto text-text-muted mb-3" size={32} />
          <p className="text-sm text-text-secondary">No dead jobs — everything is healthy</p>
        </div>
      )}

      <div className="space-y-3">
        {jobs.map((j) => (
          <div
            key={j.id}
            className="rounded-xl border border-danger/20 bg-surface-card p-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-primary text-sm">{j.source}</span>
                  <StatusBadge status={j.status} />
                </div>
                <p className="text-xs text-text-secondary mt-1 truncate max-w-md">
                  {j.query}
                </p>
                {j.last_error && (
                  <p className="text-xs text-danger/80 mt-1.5 line-clamp-2">
                    Error: {j.last_error}
                  </p>
                )}
                <p className="text-xs text-text-muted mt-1">
                  {j.attempt_count}/{j.max_attempts} attempts &middot;{" "}
                  {j.died_at && new Date(j.died_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleRetry(j.id)}
                disabled={retry.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-default bg-surface-hover text-sm text-text-secondary hover:text-accent-start hover:border-accent-start/30 transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                Retry
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
