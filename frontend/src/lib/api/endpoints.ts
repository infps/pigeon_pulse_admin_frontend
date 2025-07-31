const authEndpoints = {
  login: "/auth/admin/login",
  logout: "/auth/admin/logout",
  signup: "/auth/admin/signup",
  session: "/auth/session",
};

const schemaEndpoints = {
  getPrizes: "/schema/prizes",
  getPrize: (id: string) => `/schema/prizes/${id}`,
  getFees: "/schema/fees",
  getFee: (id: string) => `/schema/fees/${id}`,
};

export const apiEndpoints = {
  auth: authEndpoints,
  schema: schemaEndpoints,
};
