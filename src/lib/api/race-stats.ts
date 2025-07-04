import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function listRaceStats() {
  return useApiRequest({
    endpoint: apiEndpoints.raceStatsEndpoints.base,
    queryKey: ["race-stats"],
  });
}

export function getRaceStats(raceId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.raceStatsEndpoints.getRaceStats(raceId),
    queryKey: ["race-stats", raceId],
  });
}
