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
