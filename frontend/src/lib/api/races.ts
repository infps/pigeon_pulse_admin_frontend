import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function useCreateRace() {
  return useApiRequest({
    endpoint: apiEndpoints.races.create,
    method: "POST",
    invalidateKeys: [{ queryKey: ["races"] }],
  });
}

export function useListRaces(eventId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.listRaces(eventId),
    method: "GET",
    queryKey: ["races"],
  });
}
