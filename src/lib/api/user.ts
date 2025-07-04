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

export function getUserSummary(userId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.getUserSummary(userId),
    queryKey: ["users", "summary", userId],
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

export function getBirdsbyUserId(userId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.getBirdsbyUserId(userId),
    queryKey: ["users", "birds", userId],
  });
}

export function getRacesJoined(userId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.getRacesJoined(userId),
    queryKey: ["users", "races", userId],
  });
}

export function getWins(userId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.getWins(userId),
    queryKey: ["users", "wins", userId],
  });
}
export function getPayments(userId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.getPayments(userId),
    queryKey: ["users", "wins", userId],
  });
}
