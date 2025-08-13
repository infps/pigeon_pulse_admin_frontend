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

export function useListRaceItems(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.listRaceItems(raceId),
    method: "GET",
    queryKey: ["raceItems", raceId],
  });
}

export function useRaceLoftBasketing(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.loftBasketing(raceId),
    method: "PATCH",
    invalidateKeys: [{ queryKey: ["raceItems"] }],
  });
}
export function useRaceBasketing(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.races.raceBasketing(raceId),
    method: "PATCH",
    invalidateKeys: [{ queryKey: ["raceItems"] }],
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
