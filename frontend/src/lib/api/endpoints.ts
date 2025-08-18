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
  getBreeders: (id: string) => `/users/breeders/event/${id}`,
  getBreedersAddressBook: `/users/breeders`,
};

const eventInventoryEndpoints = {
  list: (eventId: string) => `/event-inventory/${eventId}`,
  updateItem: (id: string) => `/event-inventory/item/${id}`,
};

const birdsEndpoints = {
  listByEvent: (eventId: string) => `/birds/event/${eventId}`,
};

const raceEndpoints = {
  create: "/races",
  listRaces: (eventId: string) => `/races/event/${eventId}`,
  listRace: (raceId: string) => `/races/${raceId}`,
  listRaceItems: (raceId: string) => `/races/${raceId}/items`,
  loftBasketing: (raceId: string) => `/races/${raceId}/item/loft-basket`,
  raceBasketing: (raceId: string) => `/races/${raceId}/item/race-basket`,
  publishResult: (raceId: string) => `/races/${raceId}/publish-result`,
  listResults: (raceId: string) => `/races/${raceId}/results`,
};

export const apiEndpoints = {
  auth: authEndpoints,
  schema: schemaEndpoints,
  events: eventEndpoints,
  birds: birdsEndpoints,
  users: userEndpoints,
  eventInventory: eventInventoryEndpoints,
  races: raceEndpoints,
};
