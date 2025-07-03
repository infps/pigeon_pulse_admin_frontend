const dashboardEndpoints = {
  base: "/dashboard",
};

const userEndpoints = {
  base: "/users",
  getSingleUser: (userId: string) => `/users/${userId}`,
  updateUser: (userId: string) => `/users/${userId}`,
}

export const apiEndpoints = {
  dashboardEndpoints,
  userEndpoints,
};
