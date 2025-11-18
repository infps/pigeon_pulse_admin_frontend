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

export function useGetRace(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.listRace(raceId),
    method: "GET",
    queryKey: ["race", raceId],
  });
}

export function useUpdateRace(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.updateRace(raceId),
    method: "PATCH",
    invalidateKeys: [{ queryKey: ["races"] }, { queryKey: ["race", raceId] }],
  });
}

export function useListRaceItems(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.listRaceItems(raceId),
    method: "GET",
    queryKey: ["raceItems", raceId],
  });
}

export function useUpdateRaceItemBasket(raceId: string, raceItemId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.updateRaceItem(raceId, raceItemId),
    method: "PATCH",
    invalidateKeys: [
      { queryKey: ["raceItems", raceId] },
      { queryKey: ["raceBaskets", raceId] },
    ],
  });
}

export function useRaceLoftBasketing(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.loftBasketing(raceId),
    method: "POST",
    invalidateKeys: [{ queryKey: ["raceItems"] }],
  });
}
export function useRaceBasketing(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.raceBasketing(raceId),
    method: "POST",
    invalidateKeys: [{ queryKey: ["raceItems"] }],
  });
}

export function useListBaskets(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.listBaskets(raceId),
    method: "GET",
    queryKey: ["raceBaskets", raceId],
  });
}

export function useCreateBasket(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.createBasket(raceId),
    method: "POST",
    invalidateKeys: [{ queryKey: ["raceBaskets", raceId] }],
  });
}

export function useUpdateBasket(raceId: string, basketId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.updateBasket(raceId, basketId),
    method: "PATCH",
    invalidateKeys: [{ queryKey: ["raceBaskets", raceId] }],
  });
}

export function useDeleteBasket(raceId: string, basketId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.deleteBasket(raceId, basketId),
    method: "DELETE",
    invalidateKeys: [{ queryKey: ["raceBaskets", raceId] }],
  });
}

export function useAssignBasket(raceId: string, basketId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.assignBasket(raceId, basketId),
    method: "POST",
    invalidateKeys: [
      { queryKey: ["raceItems", raceId] },
      { queryKey: ["raceBaskets", raceId] },
    ],
  });
}

export function usePublishRaceResult(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.publishResult(raceId),
    method: "POST",
    invalidateKeys: [{ queryKey: ["raceResults", raceId] }],
  });
}
export function useListRaceResults(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.listResults(raceId),
    method: "GET",
    queryKey: ["raceResults", raceId],
  });
}
