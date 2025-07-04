import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function listRaces() {
  return useApiRequest({
    endpoint: apiEndpoints.racesEndpoints.base,
    queryKey: ["races", "list"],
  });
}

export function createRace() {
  return useApiRequest({
    endpoint: apiEndpoints.racesEndpoints.createRace,
    method: "POST",
    bodyType: "formdata",
    headers: {},
  });
}
export function updateRace(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.racesEndpoints.updateRace(raceId),
    method: "PATCH",
    bodyType: "formdata",
    headers: {},
    queryKey: ["races", "update", raceId],
    invalidateKeys: [{ queryKey: ["races", "list"], exact: true }],
  });
}

export function getSingleRace(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.racesEndpoints.getSingleRace(raceId),
    queryKey: ["races", "single", raceId],
  });
}
