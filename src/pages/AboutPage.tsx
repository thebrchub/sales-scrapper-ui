import {
  BookOpen,
  Search,
  Database,
  BarChart3,
  Download,
  Settings,
  Megaphone,
  Users,
  Zap,
  Shield,
} from "lucide-react";

const STEPS = [
  {
    icon: Megaphone,
    title: "Create a Campaign",
    description:
      "Define your target by selecting sources (Google Maps, Yelp, etc.), cities, and business categories. The system generates scrape jobs automatically.",
  },
  {
    icon: Zap,
    title: "Automated Scraping",
    description:
      "The scraping engine pulls jobs from the queue, visits each source, and extracts business data including phone, email, website, and tech stack.",
  },
  {
    icon: Database,
    title: "Data Processing",
    description:
      "Every lead is validated (phone format, email MX check), deduplicated across sources, scored (0-100), and stored in the database.",
  },
  {
    icon: Search,
    title: "Browse & Filter",
    description:
      "Use the Leads page to filter by city, status, or score. Click any lead to see full contact info, tech details, and validation results.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "View lead distribution by score bucket (hot/warm/cold), track totals, and identify the best opportunities at a glance.",
  },
  {
    icon: Download,
    title: "Export",
    description:
      "Export filtered leads as CSV. Apply city, status, or score filters before exporting to get exactly the data you need.",
  },
];

const TERMINOLOGY = [
  { term: "Lead Score", definition: "A 0-100 score based on signals like missing website, outdated tech, no SSL, multi-source presence." },
  { term: "Hot Lead", definition: "Score 70+. High potential — likely needs your service." },
  { term: "Warm Lead", definition: "Score 40-69. Moderate potential — worth reaching out." },
  { term: "Cold Lead", definition: "Score below 40. Lower priority but still stored for reference." },
  { term: "Campaign", definition: "A batch scraping task combining sources, cities, and categories." },
  { term: "Source", definition: "Where data is scraped from (Google Maps, Yelp, Yellow Pages, etc.)." },
  { term: "Deduplication", definition: "Leads with matching phone, email, or domain are merged instead of duplicated." },
  { term: "E.164", definition: "International phone format (e.g., +14155552671). All phones are normalized to this." },
];

export default function AboutPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="text-accent-start" size={22} />
        <h2 className="text-xl font-semibold text-text-primary">About & Guide</h2>
      </div>

      {/* About */}
      <div className="rounded-xl border border-border-default bg-surface-card p-5 mb-6">
        <h3 className="text-sm font-medium text-text-primary mb-3">About Leads Generator</h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          Leads Generator by BRC HUB LLP is an automated lead generation system that scrapes
          business data from multiple public sources, validates contact information, scores leads
          by potential, and deduplicates across sources. The system runs a Go API server for data
          management and a Node.js scraping engine for data extraction, communicating exclusively
          via Redis queues.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Shield size={14} />
            Validated contacts
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Users size={14} />
            Auto-deduplicated
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Settings size={14} />
            Configurable
          </div>
        </div>
      </div>

      {/* How It Works */}
      <h3 className="text-sm font-medium text-text-secondary mb-4">How It Works</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="rounded-xl border border-border-default bg-surface-card p-5 hover:border-accent-start/30 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-start/15 to-accent-end/15 flex items-center justify-center">
                <step.icon size={16} className="text-accent-start" />
              </div>
              <span className="text-xs text-text-muted font-medium">Step {i + 1}</span>
            </div>
            <h4 className="text-sm font-medium text-text-primary mb-1.5">{step.title}</h4>
            <p className="text-xs text-text-secondary leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Terminology */}
      <h3 className="text-sm font-medium text-text-secondary mb-4">Terminology</h3>
      <div className="rounded-xl border border-border-default bg-surface-card divide-y divide-border-subtle">
        {TERMINOLOGY.map((item) => (
          <div key={item.term} className="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="text-sm font-medium text-text-primary w-40 shrink-0">{item.term}</span>
            <span className="text-xs text-text-secondary">{item.definition}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
