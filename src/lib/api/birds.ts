import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function useListBirds({
  id,
  params,
}: {
  id: string;
  params?: Record<string, any>;
}) {
  const queryParams = params
    ? Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
    : "";
  return useApiRequest({
    endpoint: apiEndpoints.birds.listByEvent(id),
    params,
    method: "GET",
    queryKey: ["birds", id, queryParams],
  });
}
