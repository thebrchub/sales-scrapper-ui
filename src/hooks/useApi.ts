import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import type {
  Lead,
  Campaign,
  PaginatedResponse,
  LeadFilters,
  CreateCampaignPayload,
} from "../types";

function buildLeadQuery(filters: LeadFilters) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.page_size) params.set("page_size", String(filters.page_size));
  if (filters.city) params.set("city", filters.city);
  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.score_gte != null) params.set("score_gte", String(filters.score_gte));
  if (filters.has_phone != null) params.set("has_phone", String(filters.has_phone));
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
      qc.invalidateQueries({ queryKey: ["lead"] });
    },
  });
}

export function useCampaignStatus(id: string) {
  return useQuery({
    queryKey: ["campaign-status", id],
    queryFn: () => api.get<Campaign>(`/campaigns/${id}/status`),
    enabled: !!id,
    refetchInterval: 10000,
  });
}

export function useCampaigns(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["campaigns", page, pageSize],
    queryFn: () =>
      api.get<PaginatedResponse<Campaign>>(
        `/campaigns?page=${page}&page_size=${pageSize}`
      ),
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
