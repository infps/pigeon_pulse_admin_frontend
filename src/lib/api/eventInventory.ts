import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function getEventInventory(
  eventId: number,
  params: Record<string, any>
) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return useApiRequest({
    endpoint: apiEndpoints.eventInventory.list(eventId),
    method: "GET",
    params,
    queryKey: ["eventInventory", String(eventId), queryParams],
  });
}


export function getEventInventoryItem(id: number) {
  return useApiRequest({
    endpoint: apiEndpoints.eventInventory.getDetails(id),
    method: "GET",
    queryKey: ["eventInventory", String(id)],
  });
}

export function updateEventInventoryItem(id: number) {
  return useApiRequest({
    endpoint: apiEndpoints.eventInventory.updateItem(id),
    method: "PUT",
    queryKey: ["eventInventory", String(id)],
    invalidateKeys: [{ queryKey: ["eventInventory"] }, { queryKey: ["birds"] }],
  });
}
