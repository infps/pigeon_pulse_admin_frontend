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

const eventEndpoints = {
  listEvents: "/events/my",
  getEvent: (id: string) => `/events/${id}`,
  createEvent: "/events",
};

const userEndpoints = {
  getProfile: "/users/profile",
  updateProfile: "/users/profile",
};

export const apiEndpoints = {
  auth: authEndpoints,
  schema: schemaEndpoints,
  events: eventEndpoints,
  users: userEndpoints,
};
