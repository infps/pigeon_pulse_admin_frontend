import useApiRequest from "../fetch-controller";
import { apiEndpoints } from "./endpoints";

export function useGetProfile() {
  return useApiRequest({
    endpoint: apiEndpoints.users.getProfile,
    method: "GET",
    queryKey: ["userProfile"],
  });
}

export function useUpdateProfile() {
  return useApiRequest({
    endpoint: apiEndpoints.users.updateProfile,
    method: "PUT",
    invalidateKeys: [{ queryKey: ["userProfile"] }],
  });
}

export function useGetBreeders(eventId: string) {
  return useApiRequest({
    endpoint: apiEndpoints.users.getBreeders(eventId),
    method: "GET",
    queryKey: ["breeders", eventId],
  });
}

export function useGetBreederAddressBook(params: Record<string, any>) {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return useApiRequest({
    endpoint: apiEndpoints.users.getBreedersAddressBook,
    method: "GET",
    params,
    queryKey: ["breederAddressBook", queryParams],
  });
}
