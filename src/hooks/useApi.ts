import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import type {
  Lead,
  Campaign,
  ScrapeJob,
  PaginatedResponse,
  LeadFilters,
  CreateCampaignPayload,
  DashboardStats,
} from "../types";

function buildLeadQuery(filters: LeadFilters) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.page_size) params.set("page_size", String(filters.page_size));
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.city) params.set("city", filters.city);
  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.score_gte != null) params.set("score_gte", String(filters.score_gte));
  if (filters.score_lte != null) params.set("score_lte", String(filters.score_lte));
  if (filters.has_phone != null) params.set("has_phone", String(filters.has_phone));
  if (filters.has_email != null) params.set("has_email", String(filters.has_email));
  if (filters.search) params.set("search", filters.search);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useLeads(filters: LeadFilters) {
  return useQuery({
    queryKey: ["leads", filters],
    queryFn: () => api.get<PaginatedResponse<Lead>>(`/leads${buildLeadQuery(filters)}`),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => api.get<Lead>(`/leads/${id}`),
    enabled: !!id,
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      api.patch<Lead>(`/leads/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: () => api.get<PaginatedResponse<Campaign>>("/campaigns"),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: () => api.get<Campaign>(`/campaigns/${id}`),
    enabled: !!id,
    refetchInterval: 10000,
  });
}

export function useCampaignJobs(id: string) {
  return useQuery({
    queryKey: ["campaign-jobs", id],
    queryFn: () => api.get<PaginatedResponse<ScrapeJob>>(`/campaigns/${id}/jobs`),
    enabled: !!id,
    refetchInterval: 10000,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) =>
      api.post<Campaign>("/campaigns", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useDeadJobs() {
  return useQuery({
    queryKey: ["dead-jobs"],
    queryFn: () => api.get<PaginatedResponse<ScrapeJob>>("/jobs?status=dead"),
  });
}

export function useRetryJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/jobs/${id}/retry`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dead-jobs"] });
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get<DashboardStats>("/stats"),
    refetchInterval: 30000,
  });
}
