import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function listUsers() {
  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.base,
    queryKey: ["users", "list"],
  });
}

export function getSingleUser(userId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.getSingleUser(userId),
    queryKey: ["users", "get", userId],
  });
}

export function updateUser(userId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.updateUser(userId),
    queryKey: ["users", "get", userId],
    method: "PUT",
    exact: true,
    invalidateKeys: [
      { queryKey: ["users", "list"], exact: true },
      { queryKey: ["users", "get", userId], exact: true },
    ],
  });
}
