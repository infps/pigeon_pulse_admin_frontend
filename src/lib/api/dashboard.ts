import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function listDashboardData({ params }: { params: Record<string, string> }) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
    
  return useApiRequest({
    endpoint: apiEndpoints.dashboardEndpoints.base,
    queryKey: ["homepage", "dashboard", queryParams],
    params,
  });
}
