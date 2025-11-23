import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function useCreateRace() {
  return useApiRequest({
    endpoint: apiEndpoints.races.create,
    method: "POST",
    invalidateKeys: [{ queryKey: ["races"] }],
  });
}

export function useListRaces(eventId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.races.listRaces(eventId),
    method: "GET",
    queryKey: ["races"],
  });
}

export function useGetRace(raceId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.races.listRace(raceId),
    method: "GET",
    queryKey: ["race", String(raceId)],
  });
}

export function useUpdateRace(raceId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.races.updateRace(raceId),
    method: "PATCH",
    invalidateKeys: [{ queryKey: ["races"] }, { queryKey: ["race", String(raceId)] }],
  });
}

export function useListRaceItems(raceId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.races.listRaceItems(raceId),
    method: "GET",
    queryKey: ["raceItems", String(raceId)],
  });
}

export function useUpdateRaceItemBasket(raceId: number, raceItemId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.races.updateRaceItem(raceId, raceItemId),
    method: "PATCH",
    invalidateKeys: [
      { queryKey: ["raceItems", String(raceId)] },
      { queryKey: ["raceBaskets", String(raceId)] },
    ],
  });
}

export function useRaceLoftBasketing(raceId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.races.loftBasketing(raceId),
    method: "POST",
    invalidateKeys: [{ queryKey: ["raceItems"] }],
  });
}
export function useRaceBasketing(raceId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.races.raceBasketing(raceId),
    method: "POST",
    invalidateKeys: [{ queryKey: ["raceItems"] }],
  });
}

export function useListBaskets(raceId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.races.listBaskets(raceId),
    method: "GET",
    queryKey: ["raceBaskets", String(raceId)],
  });
}

export function useCreateBasket(raceId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.races.createBasket(raceId),
    method: "POST",
    invalidateKeys: [{ queryKey: ["raceBaskets", String(raceId)] }],
  });
}

export function useUpdateBasket(raceId: number, basketId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.races.updateBasket(raceId, basketId),
    method: "PATCH",
    invalidateKeys: [{ queryKey: ["raceBaskets", String(raceId)] }],
  });
}

export function useDeleteBasket(raceId: number, basketId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.races.deleteBasket(raceId, basketId),
    method: "DELETE",
    invalidateKeys: [{ queryKey: ["raceBaskets", String(raceId)] }],
  });
}

export function useAssignBasket(raceId: number, basketId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.races.assignBasket(raceId, basketId),
    method: "POST",
    invalidateKeys: [
      { queryKey: ["raceItems", String(raceId)] },
      { queryKey: ["raceBaskets", String(raceId)] },
    ],
  });
}

export function usePublishRaceResult(raceId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.races.publishResult(raceId),
    method: "POST",
    invalidateKeys: [{ queryKey: ["raceResults", String(raceId)] }],
  });
}
export function useListRaceResults(raceId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.races.listResults(raceId),
    method: "GET",
    queryKey: ["raceResults", String(raceId)],
  });
}
