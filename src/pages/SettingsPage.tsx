import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Settings className="text-text-secondary" size={22} />
        <h2 className="text-xl font-semibold text-text-primary">Settings</h2>
      </div>

      <div className="rounded-xl border border-border-default bg-surface-card p-5 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Watchdog Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">
                Stale Threshold (seconds)
              </label>
              <input
                type="number"
                defaultValue={600}
                className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-start transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">
                Max Attempts
              </label>
              <input
                type="number"
                defaultValue={3}
                className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-start transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">
                Watchdog Interval (seconds)
              </label>
              <input
                type="number"
                defaultValue={120}
                className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-start transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">
                Drain Batch Size
              </label>
              <input
                type="number"
                defaultValue={100}
                className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-start transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border-default pt-5">
          <h3 className="text-sm font-medium text-text-primary mb-3">Source Timeouts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { source: "Google Maps", timeout: 480 },
              { source: "Yelp", timeout: 180 },
              { source: "Yellow Pages", timeout: 180 },
              { source: "Google Dorks", timeout: 300 },
              { source: "Reddit", timeout: 120 },
              { source: "New Domains", timeout: 120 },
            ].map((item) => (
              <div key={item.source}>
                <label className="block text-xs text-text-secondary mb-1.5">
                  {item.source} (sec)
                </label>
                <input
                  type="number"
                  defaultValue={item.timeout}
                  className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-start transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-accent-start to-accent-end text-sm font-medium text-surface transition-opacity hover:opacity-90 cursor-pointer">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
