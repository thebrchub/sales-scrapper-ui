export interface Lead {
  id: string;
  business_name: string;
  category: string;
  phone_e164: string | null;
  phone_valid: boolean;
  phone_type: string | null;
  phone_confidence: number;
  email: string | null;
  email_valid: boolean;
  email_catchall: boolean;
  email_disposable: boolean;
  email_confidence: number;
  website_url: string | null;
  website_domain: string | null;
  address: string | null;
  city: string;
  country: string;
  source: string[];
  lead_score: number;
  tech_stack: Record<string, string> | null;
  has_ssl: boolean | null;
  is_mobile_friendly: boolean | null;
  status: "new" | "contacted" | "qualified" | "converted" | "closed";
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
  city: string;
  category: string;
  status: "pending" | "running" | "completed" | "failed" | "dead";
  attempt_count: number;
  max_attempts: number;
  timeout_seconds: number;
  leads_found: number;
  last_error: string | null;
  started_at: string | null;
  completed_at: string | null;
  died_at: string | null;
  campaign_id: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface LeadFilters {
  page?: number;
  page_size?: number;
  city?: string;
  status?: string;
  source?: string;
  score_gte?: number;
  has_phone?: boolean;
}

export interface CreateCampaignPayload {
  name: string;
  sources: string[];
  cities: string[];
  categories: string[];
  auto_rescrape?: boolean;
}
