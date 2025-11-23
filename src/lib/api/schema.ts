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

export function useGetPrize(id: number) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getPrize(id),
    method: "GET",
    queryKey: ["prize", String(id)],
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

export function useGetFee(id: number) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getFee(id),
    method: "GET",
    queryKey: ["fee", String(id)],
  });
}

export function useCreatePrize() {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getPrizes,
    method: "POST",
    invalidateKeys: [{ queryKey: ["prizes"] }],
  });
}

export function useUpdatePrize(id: number) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getPrize(id),
    method: "PUT",
    invalidateKeys: [{ queryKey: ["prize", String(id)] }],
  });
}
export function useDeletePrize(id: number) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getPrize(id),
    method: "DELETE",
    invalidateKeys: [{ queryKey: ["prize", String(id)] }],
  });
}

export function useCreateFee() {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getFees,
    method: "POST",
    invalidateKeys: [{ queryKey: ["fees"] }],
  });
}
export function useUpdateFee(id: number) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getFee(id),
    method: "PUT",
    invalidateKeys: [{ queryKey: ["fee", String(id)] }],
  });
}
export function useDeleteFee(id: number) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getFee(id),
    method: "DELETE",
    invalidateKeys: [{ queryKey: ["fee", String(id)] }],
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

export function useGetBetting(id: number) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getBetting(id),
    method: "GET",
    queryKey: ["betting", String(id)],
  });
}

export function useCreateBetting() {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getBettings,
    method: "POST",
    invalidateKeys: [{ queryKey: ["bettings"] }],
  });
}

export function useUpdateBetting(id: number) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getBetting(id),
    method: "PUT",
    invalidateKeys: [{ queryKey: ["betting", String(id)] }],
  });
}

export function useDeleteBetting(id: number) {
  return useApiRequest({
    endpoint: apiEndpoints.schema.getBetting(id),
    method: "DELETE",
    invalidateKeys: [{ queryKey: ["betting", String(id)] }],
  });
}
