import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function useGetPrizes({ params }: { params: Record<string, string> }) {
  const queryParmas = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return useApiRequest({
    endpoint: apiEndpoints.schema.getPrizes,
    params,
    queryKey: ["prizes", queryParmas],
  });
}

export function useGetPrize(id: string) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getPrize(id),
    method: "GET",
    queryKey: ["prize", id],
  });
}

export function useGetFees({ params }: { params: Record<string, string> }) {
  const queryParmas = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return useApiRequest({
    endpoint: apiEndpoints.schema.getFees,
    params,
    queryKey: ["fees", queryParmas],
  });
}

export function useGetFee(id: string) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getFee(id),
    method: "GET",
    queryKey: ["fee", id],
  });
}

export function useCreatePrize() {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getPrizes,
    method: "POST",
    invalidateKeys: [{ queryKey: ["prizes"] }],
  });
}

export function useUpdatePrize(id: string) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getPrize(id),
    method: "PUT",
    invalidateKeys: [{ queryKey: ["prize", id] }],
  });
}
export function useDeletePrize(id: string) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getPrize(id),
    method: "DELETE",
    invalidateKeys: [{ queryKey: ["prize", id] }],
  });
}

export function useCreateFee() {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getFees,
    method: "POST",
    invalidateKeys: [{ queryKey: ["fees"] }],
  });
}
export function useUpdateFee(id: string) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getFee(id),
    method: "PUT",
    invalidateKeys: [{ queryKey: ["fee", id] }],
  });
}
export function useDeleteFee(id: string) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getFee(id),
    method: "DELETE",
    invalidateKeys: [{ queryKey: ["fee", id] }],
  });
}

export function useGetBettings({ params }: { params: Record<string, string> }) {
  const queryParmas = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return useApiRequest({
    endpoint: apiEndpoints.schema.getBettings,
    params,
    queryKey: ["bettings", queryParmas],
  });
}

export function useGetBetting(id: string) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getBetting(id),
    method: "GET",
    queryKey: ["betting", id],
  });
}

export function useCreateBetting() {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getBettings,
    method: "POST",
    invalidateKeys: [{ queryKey: ["bettings"] }],
  });
}

export function useUpdateBetting(id: string) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getBetting(id),
    method: "PUT",
    invalidateKeys: [{ queryKey: ["betting", id] }],
  });
}

export function useDeleteBetting(id: string) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getBetting(id),
    method: "DELETE",
    invalidateKeys: [{ queryKey: ["betting", id] }],
  });
}
