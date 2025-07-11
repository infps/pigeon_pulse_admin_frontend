import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function listUsers({ params }: { params: Record<string, string> }) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.base,
    queryKey: ["users", "list", queryParams],
    params,
  });
}

export function getSingleUser({
  params,
  userId,
}: {
  params: Record<string, string>;
  userId: string;
}) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.getSingleUser(userId),
    queryKey: ["users", "get", userId, queryParams],
    params,
  });
}

export function getUserSummary({
  params,
  userId,
}: {
  params: Record<string, string>;
  userId: string;
}) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.getUserSummary(userId),
    queryKey: ["users", "summary", userId, queryParams],
    params,
  });
}

export function updateUser({
  params,
  userId,
}: {
  params: Record<string, string>;
  userId: string;
}) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.updateUser(userId),
    queryKey: ["users", "update", userId, queryParams],
    method: "PUT",
    params,
    exact: true,
    invalidateKeys: [
      { queryKey: ["users", "list"], exact: false },
      { queryKey: ["users", "get", userId], exact: false },
      { queryKey: ["users", "summary", userId], exact: false },
    ],
  });
}

export function getBirdsbyUserId({
  params,
  userId,
}: {
  params: Record<string, string>;
  userId: string;
}) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.getBirdsbyUserId(userId),
    queryKey: ["users", "birds", userId, queryParams],
    params,
  });
}

export function getRacesJoined({
  params,
  userId,
}: {
  params: Record<string, string>;
  userId: string;
}) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.getRacesJoined(userId),
    queryKey: ["users", "races", userId, queryParams],
    params,
  });
}

export function getWins({
  params,
  userId,
}: {
  params: Record<string, string>;
  userId: string;
}) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.getWins(userId),
    queryKey: ["users", "wins", userId, queryParams],
    params,
  });
}
export function getPayments({
  params,
  userId,
}: {
  params: Record<string, string>;
  userId: string;
}) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return useApiRequest({
    endpoint: apiEndpoints.userEndpoints.getPayments(userId),
    queryKey: ["users", "payments", userId, queryParams],
    params,
  });
}

export function getHospitality({ params }: { params: Record<string, string> }) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return useApiRequest({
    endpoint: apiEndpoints.dashboardEndpoints.hospitality,
    queryKey: ["dashboard", "hospitality", queryParams],
    params,
  });
}
