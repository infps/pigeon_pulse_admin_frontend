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

export function useGetBreeders(eventId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.users.getBreeders(eventId),
    method: "GET",
    queryKey: ["breeders", String(eventId)],
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

export function useGetBreeder(breederId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.users.getBreeder(breederId),
    method: "GET",
    queryKey: ["breeder", String(breederId)],
    enabled: breederId > 0,
  });
}

export function useCreateBreeder() {
  return useApiRequest({
    endpoint: apiEndpoints.users.createBreeder,
    method: "POST",
    invalidateKeys: [{ queryKey: ["breederAddressBook"] }],
  });
}

export function useUpdateBreeder(breederId: number) {
  return useApiRequest({
    endpoint: apiEndpoints.users.updateBreeder(breederId),
    method: "PUT",
    invalidateKeys: [{ queryKey: ["breederAddressBook"] }, { queryKey: ["breeder", String(breederId)] }],
  });
}
