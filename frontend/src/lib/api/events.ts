import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function useListEvents({
  params,
}: { params?: Record<string, any> } = {}) {
  const queryParams = params
    ? Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
    : "";

  return useApiRequest({
    endpoint: apiEndpoints.events.listEvents,
    params,
    queryKey: ["events", queryParams],
  });
}

export function useGetEvent(id: string) {
  return useApiRequest({
    endpoint: apiEndpoints.events.getEvent(id),
    method: "GET",
    queryKey: ["event", id],
  });
}

export function useCreateEvent() {
  return useApiRequest({
    endpoint: apiEndpoints.events.createEvent,
    method: "POST",
    invalidateKeys: [{ queryKey: ["events"] }],
  });
}

export function useUpdateEvent(id: string) {
  return useApiRequest({
    endpoint: apiEndpoints.events.getEvent(id),
    method: "PUT",
    invalidateKeys: [
      { queryKey: ["event", id] },
      { queryKey: ["events"], exact: false },
    ],
  });
}
