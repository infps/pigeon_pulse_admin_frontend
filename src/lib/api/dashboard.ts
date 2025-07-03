import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function listDashboardData() {
  const res = useApiRequest({
    endpoint: apiEndpoints.dashboardEndpoints.base,
    queryKey:["homepage","dashboard"]
  });
  return res;
}
