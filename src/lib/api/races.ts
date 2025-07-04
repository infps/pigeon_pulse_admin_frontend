import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function listRaces({ params }: { params: Record<string, string> }) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
    
  return useApiRequest({
    endpoint: apiEndpoints.racesEndpoints.base,
    queryKey: ["races", "list", queryParams],
    params,
  });
}

export function createRace({ params }: { params: Record<string, string> }) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
    
  return useApiRequest({
    endpoint: apiEndpoints.racesEndpoints.createRace,
    method: "POST",
    bodyType: "formdata",
    headers: {},
    queryKey: ["races", "create", queryParams],
    params,
    invalidateKeys: [
      { queryKey: ["races", "list"], exact: false },
    ],
  });
}

export function updateRace({ 
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
    endpoint: apiEndpoints.racesEndpoints.updateRace(raceId),
    method: "PATCH",
    bodyType: "formdata",
    headers: {},
    queryKey: ["races", "update", raceId, queryParams],
    params,
    invalidateKeys: [
      { queryKey: ["races", "list"], exact: false },
      { queryKey: ["races", "single", raceId], exact: false },
    ],
  });
}

export function getSingleRace({ 
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
    endpoint: apiEndpoints.racesEndpoints.getSingleRace(raceId),
    queryKey: ["races", "single", raceId, queryParams],
    params,
  });
}
