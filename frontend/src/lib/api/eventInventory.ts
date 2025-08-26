import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function getEventInventory(
  eventId: string,
  params: Record<string, any>
) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return useApiRequest({
    endpoint: apiEndpoints.eventInventory.list(eventId),
    method: "GET",
    params,
    queryKey: ["eventInventory", eventId, queryParams],
  });
}


export function getEventInventoryItem(id: string) {
  return useApiRequest({
    endpoint: apiEndpoints.eventInventory.getDetails(id),
    method: "GET",
    queryKey: ["eventInventory", id],
  });
}

export function updateEventInventoryItem(id: string) {
  return useApiRequest({
    endpoint: apiEndpoints.eventInventory.updateItem(id),
    method: "PUT",
    queryKey: ["eventInventory", id],
    invalidateKeys: [{ queryKey: ["eventInventory"] }, { queryKey: ["birds"] }],
  });
}
