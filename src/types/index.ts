export interface Lead {
  id: string;
  business_name: string;
  category: string;
  phone_e164: string | null;
  phone_valid: boolean;
  phone_type: string;
  phone_confidence: number;
  email: string | null;
  email_valid: boolean;
  email_catchall: boolean;
  email_disposable: boolean;
  email_confidence: number;
  website_url: string | null;
  address: string | null;
  city: string;
  country: string;
  source: string[];
  lead_score: number;
  tech_stack: Record<string, string> | null;
  has_ssl: boolean;
  is_mobile_friendly: boolean;
  status: "new" | "contacted" | "converted" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  sources: string[];
  cities: string[];
  categories: string[];
  status: string;
  jobs_total: number;
  jobs_completed: number;
  leads_found: number;
  auto_rescrape: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScrapeJob {
  id: string;
  source: string;
  query: string;
  status: "pending" | "in_progress" | "completed" | "timeout" | "failed" | "dead";
  attempt_count: number;
  max_attempts: number;
  timeout_seconds: number;
  leads_found: number;
  last_error: string | null;
  started_at: string | null;
  completed_at: string | null;
  died_at: string | null;
  campaign_id: string;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface LeadFilters {
  page?: number;
  page_size?: number;
  sort?: string;
  city?: string;
  status?: string;
  source?: string;
  score_gte?: number;
  score_lte?: number;
  has_phone?: boolean;
  has_email?: boolean;
  phone_valid?: boolean;
  email_valid?: boolean;
  search?: string;
}

export interface DashboardStats {
  total_leads: number;
  total_campaigns: number;
  active_jobs: number;
  dead_jobs: number;
  leads_today: number;
  avg_score: number;
  hot_leads: number;
  warm_leads: number;
  cold_leads: number;
}

export interface CreateCampaignPayload {
  name: string;
  sources: string[];
  cities: string[];
  categories: string[];
}
