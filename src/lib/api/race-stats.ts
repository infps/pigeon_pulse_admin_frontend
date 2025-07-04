import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function listRaceStats({ params }: { params: Record<string, string> }) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
    
  return useApiRequest({
    endpoint: apiEndpoints.raceStatsEndpoints.base,
    queryKey: ["race-stats", "list", queryParams],
    params,
  });
}

export function getRaceStats({ 
  params, 
  raceId 
}: { 
  params: Record<string, string>;
  raceId: string;
}) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
    
  return useApiRequest({
    endpoint: apiEndpoints.raceStatsEndpoints.getRaceStats(raceId),
    queryKey: ["race-stats", "get", raceId, queryParams],
    params,
  });
}
