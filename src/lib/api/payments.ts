import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function listPayments() {
  return useApiRequest({
    endpoint: apiEndpoints.paymentsEndpoints.base,
    queryKey: ["payments", "list"],
  });
}